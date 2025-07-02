import { defineNuxtModule, addImportsDir, addImports, createResolver } from '@nuxt/kit'
import { normalize, dirname } from 'node:path'
import { mkdir, readFile, unlink, writeFile, rm, rename, access } from 'node:fs/promises'
import { Project, SyntaxKind, Node, type Symbol, type ExportAssignment, type ProjectOptions, TypeAliasDeclaration, SourceFile } from 'ts-morph'
import { glob } from 'tinyglobby'
import pLimit from 'p-limit'
import xxhash from 'xxhash-wasm'
import { info, error, success, warn } from './logger'
import storage from 'node-persist'


export interface ApiGeneratorModuleOptions {
  /** Custom path to the source files (default: 'api') */
  sourcePath: string
  /** Output path (default: 'node_modules/.nuxt-api-generator/composables') */
  outputPath: string,
  /** Composable name prefix (default: 'useTFetch') */
  composableName: string,
  /** @see https://ts-morph.com/setup/ */
  tsMorphOptions: ProjectOptions
}

type EndpointStructure = {
  url: string,
  slugs: string[],
  method: 'get' | 'post' | 'put' | 'delete',
  name: string
}

let _tsProject: Project | null = null
let _composableTemplate: string | null = null

const _fileGenIds = new Map<string, number>()
const { h64Raw } = await xxhash()

export default defineNuxtModule<ApiGeneratorModuleOptions>({
  meta: {
    name: 'nuxt-api-generator',
    configKey: 'apiGenerator'
  },
  defaults: {
    sourcePath: 'api',
    outputPath: '.nuxt-api-generator',
    composableName: 'useTFetch',
    tsMorphOptions: {
      skipFileDependencyResolution: true,
      // skipAddingFilesFromTsConfig: true --> // much faster, but works only if api files doesn't include types from another files
      // skipLoadingLibFiles: true,        --> // much faster, but works only if api files doesn't include types from another files
      compilerOptions: {
        skipLibCheck: true,
        allowJs: false,
        declaration: false,
        noEmit: true,
        preserveConstEnums: false
      },
    }
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    _tsProject ??= new Project({ tsConfigFilePath: resolve(nuxt.options.serverDir, 'tsconfig.json').replace(/\\/g, '/'), ...options.tsMorphOptions })
    _composableTemplate ??= await readFile(resolve(import.meta.dirname, 'runtime/templates/fetch.txt'), 'utf8')

    const outputFolder = resolve(nuxt.options.rootDir, `node_modules/${options.outputPath}/composables`).replace(/\\/g, '/')
    const sourcePath = resolve(nuxt.options.serverDir, options.sourcePath!).replace(/\\/g, '/')
    if(!await isFolderExists(sourcePath)) {
      error(`Source path "${sourcePath}" doesn't exist`)
      return
    }

    await storage.init({ dir: resolve(nuxt.options.rootDir, `node_modules/${options.outputPath}/storage`).replace(/\\/g, '/'), encoding: 'utf-8' })
    const limit = pLimit(50)

    const executor = async (e: string, isUpdate?: boolean, silent: boolean = true) =>  {
      if(!await readFile(e, 'utf-8').then((content) => content.includes('defineAdwancedEventHandler') ? true : false).catch(() => false)) return

      const id = (_fileGenIds.get(e) || 0) + 1
      _fileGenIds.set(e, id)

      const et = await extractTypesFromEndpoint(e, isUpdate)
      const es = getEndpointStructure(e, sourcePath, options.sourcePath!)

      const fnCode = _composableTemplate!
        .replace(/:inputType/g, et[0])
        .replace(/:responseType/g, et[1])
        .replace(/:url/g, `\`${es.url}\``)
        .replace(/:method/g, `'${es.method}'`)
        .replace(/:apiNamePrefix/g, options.composableName)
        .replace(/:apiFnName/g, es.name)
        .replace(
          /:inputData/g,
          (['get', 'delete'].includes(es.method) ? 'params' : 'body') + `: apiGenOmit(data, ${JSON.stringify(es.slugs)})`
        )

      const fileName = options.composableName + es.name
      const path = resolve(outputFolder, `${fileName}.ts`).replace(/\\/g, '/')

      if(_fileGenIds.get(e) !== id) return

      await createFile(path, fnCode)
      addImports([
        { name: fileName, as: fileName, from: path },
        { name: fileName+'Async', as: fileName+'Async', from: path }
      ])

      await storage.setItem(e, { c: path, hash: await hashFile(e) })
      if(!silent) success(`Successfully ${isUpdate ? 'updated' : 'generated'} ${fileName} fetcher`)
    }

    const endpoints = await findEndpoints(sourcePath)

    if(endpoints.length > 0 /*&& (nuxt.options._prepare || nuxt.options._build || !await isFolderExists(outputFolder))*/) {
      const result = await Promise.allSettled(endpoints.map(e => limit(() => executor(e))))

      const fulfilled = result.filter(r => r.status === 'fulfilled').map(r => r.value!)
      if(fulfilled.length) success(`Generated ${fulfilled.length} endpoints`)

      const errors = result.filter(r => r.status === 'rejected').map(r => r.reason)
      if(errors.length) error(`Errors during generation ${errors.length}:`)
      for(const err of errors) error(err)
    }

    if(!nuxt.options._prepare && !nuxt.options._build) {
      info('The endpoint change watcher has started successfully')

      nuxt.hook('builder:watch', async (event, path) => {
        const isProcessFile = path.includes(sourcePath.split('/').slice(-1 * (options.sourcePath!.split('/').length + 1)).join('/')) && /\.(get|post|put|delete)\.ts$/s.test(path)
        const endpoint = resolve(nuxt.options.rootDir, path).replace(/\\/g, '/')

        if((event === 'change' || event === 'add') && isProcessFile) {
          executor(endpoint, event === 'change', false)
        }
        else if(event === 'unlink' && isProcessFile) {
          await unlink((await storage.getItem(endpoint)).c)
          await storage.removeItem(endpoint)
        }
      })
    }

    addImportsDir(['utils'].map(d => resolve(`./runtime/${d}`)))
  }
})

async function findEndpoints(apiDir: string) {
  const endpoints = await glob('**/*.(get|post|put|delete).ts', { cwd: apiDir, absolute: true })
  return await compareWithStore(endpoints)
}

async function extractTypesFromEndpoint(endpoint: string, isUpdate?: boolean): Promise<[string, string]> {
  const result: [string, string] = ['', '']
  console.time('nuxt-api-generator')
  let sf = _tsProject!.getSourceFile(endpoint) || _tsProject!.addSourceFileAtPath(endpoint)

  if(isUpdate) {
    sf = _tsProject!.removeSourceFile(sf) && _tsProject!.addSourceFileAtPath(endpoint)
    await sf.refreshFromFileSystem()
  }

  const handler = sf.getExportAssignment((exp: ExportAssignment) => {
    const expression = exp.getExpressionIfKind(SyntaxKind.CallExpression)
    if (!expression) return false

    const identifier = expression.getExpressionIfKind(SyntaxKind.Identifier)
    return /^defineAdwancedEventHandler$/s.test(identifier?.getText() || '')
  })?.getExpressionIfKind(SyntaxKind.CallExpression)

  const getAliasType = (aliasSymbol: Symbol | undefined) => {
    const aliasType = aliasSymbol?.getDeclarations().find(Node.isTypeAliasDeclaration) as TypeAliasDeclaration | undefined
    return aliasType?.getTypeNode()?.getText({ trimLeadingIndentation: true }).replace(/(\r\n|\n|\r)/gm, '') || 'unknown'
  }

  const aliasSymbolPayload = handler?.getTypeArguments()[0].getType()?.getAliasSymbol()
  result[0] = aliasSymbolPayload
    ? getAliasType(aliasSymbolPayload)
    : handler?.getTypeArguments()[0].getText().replace(/(\r\n|\n|\r)/gm, '') || 'unknown'

  const arrow = handler?.getArguments()[0].asKindOrThrow(SyntaxKind.ArrowFunction)
  let responseType = arrow?.getReturnType().getTypeArguments()[0]
  while (responseType?.getSymbol()?.getName() === 'Promise') {
    responseType = responseType.getTypeArguments()[0]
  }

  result[1] = responseType?.getText().replace(/(\r\n|\n|\r)/gm, '') || 'unknown'

  result.forEach((t, i) => {
    if(t === 'unknown')
      warn(`Can't find ${i === 0 ? 'payload' : 'response'} type for endpoint ${endpoint}, it will be unknown`)
  })

  console.timeEnd('nuxt-api-generator')
  return result
}

function getEndpointStructure(endpoint: string, sourcePath: string, baseUrl: string): EndpointStructure {
  const d = {
    get: 'get',
    post: 'create',
    put: 'update',
    delete: 'remove'
  }

  const base = endpoint.replace(/.ts$/s, '').split(sourcePath)[1]
  const path = base.split('/')

  const nameParts = path[path.length - 1].split('.')
  const method = nameParts[1] as keyof typeof d

  const namePath = path.slice(0, -1).map(p => capitalize(p.replaceAll(/\[|\]/g, ''))).join('')
  const name = /\[.+\]/s.test(nameParts[0])
    ? d[method] + 'By' + capitalize(nameParts[0].replaceAll(/\[|\]/g, ''))
    : nameParts[0] === 'index'
      ? d[method]
      : capitalize(nameParts[0]) + capitalize(d[method])

  const slugs: string[] = []
  const url = normalize(baseUrl + '/' + path.map(p => {
    p = /\[.+\]\.(get|post|put|delete)/s.test(p) ? p.split('.')[0] : p
    if(/\[.+\]/s.test(p)) {
      const slug = p.replaceAll(/\[|\]/g, '')
      slugs.push(slug)

      return '${data.' + slug + '}'
    }
    else return p
  }).join('/')).replace(/\\/g, '/')

  return {
    url,
    slugs,
    method,
    name: namePath + capitalize(name)
  }
}

async function createFile(path: string, content: string) {
  const dir = dirname(path)
  await mkdir(dir, { recursive: true })
  await writeFile(`${path}.tmp`, content)
  await rename(`${path}.tmp`, path)
}

async function hashFile(filePath: string) {
  const data = await readFile(filePath)
  return h64Raw(new Uint8Array(data), 0n).toString(16).padStart(16, '0')
}

async function compareWithStore(endpoints: string[]) {
  const changed: string[] = []

  const lookup = Object.create(null) as Record<string, boolean>;
  for(let i = 0, len = endpoints.length; i < len; i++) {
    lookup[endpoints[i]] = true
  }

  for(const key of await storage.keys()) {
    if(!lookup[key]) {
      await rm((await storage.getItem(key)).c)
      await storage.removeItem(key)
    }
  }

  for(let i = 0, len = endpoints.length; i < len; i++) {
    const k = endpoints[i]

    if((await storage.getItem(k))?.hash === (await hashFile(k))) continue
    changed.push(k)
  }

  return changed
}

async function isFolderExists(folder: string) {
  try {
    await access(folder)
    return true
  } catch {
    return false
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
