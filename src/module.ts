import { defineNuxtModule, addImportsDir, addImports, createResolver } from '@nuxt/kit'
import { resolve, normalize, dirname, relative } from 'node:path'
import { mkdir, readFile, unlink, writeFile, rm, rename } from 'node:fs/promises'
import { availableParallelism } from 'node:os'
import { Project, SyntaxKind, Node, type Symbol, type ExportAssignment, type ProjectOptions, TypeAliasDeclaration } from 'ts-morph'
import { glob } from 'tinyglobby'
import pLimit from 'p-limit'
import xxhash from 'xxhash-wasm'
import { existsSync } from 'node:fs'

export interface ApiGeneratorModuleOptions {
  /** Custom path to the source files (default: 'api') */
  sourcePath: string
  /** Output path (default: 'node_modules/@nuxt-api-generator/composables') */
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

let _fileHashes: Map<string, string> | null = null
let _tsProject: Project | null = null
let _template: string | null = null

const _fileGenIds = new Map<string, number>()

const { h64Raw } = await xxhash()

export default defineNuxtModule<ApiGeneratorModuleOptions>({
  meta: {
    name: 'nuxt-api-generator',
    configKey: 'apiGenerator'
  },
  defaults: {
    sourcePath: 'api',
    outputPath: '@nuxt-api-generator',
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

    // console.time('nuxt-api-generator')
    const sourcePath = resolve(nuxt.options.serverDir, options.sourcePath!).replace(/\\/g, '/')
    const cacheFilePath = resolve(nuxt.options.rootDir, `node_modules/${options.outputPath}/cache.json`)

    _fileHashes ??= await readAllCache(cacheFilePath)
    const endpoints = await findEndpoints(sourcePath, true)

    console.log(`Found ${endpoints.length} endpoints`);

    if (endpoints.length === 0) return

    _tsProject ??= new Project({ tsConfigFilePath: resolve(nuxt.options.serverDir, 'tsconfig.json').replace(/\\/g, '/'), ...options.tsMorphOptions })
    _template ??= await readFile(resolve(__dirname, 'runtime/templates/fetch.txt'), 'utf8')

    const outputFolder = resolve(nuxt.options.rootDir, `node_modules/${options.outputPath}/composables`).replace(/\\/g, '/')
    const limit = pLimit(availableParallelism() - 1 || 1)

    const executor = async (e: string, isUpdate?: boolean) =>  {
      const id = (_fileGenIds.get(e) || 0) + 1
      _fileGenIds.set(e, id)

      const et = await extractTypesFromEndpoint(e, _tsProject!, isUpdate)
      const es = getEndpointStructure(e, sourcePath, options.sourcePath!)

      const fnCode = _template!
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
    }

    if(!nuxt.options._prepare && !nuxt.options._build) {
      nuxt.hook('builder:watch', async (event, path) => {
        const isProcessFile = path.includes(sourcePath.split('/').slice(-1*(options.sourcePath!.split('/').length + 1)).join('/')) && /\.(get|post|put|delete)\.ts$/s.test(path)

        if((event === 'change' || event === 'add') && isProcessFile) {
          executor(resolve(nuxt.options.rootDir, path).replace(/\\/g, '/'), event === 'change')
        }
        else if(event === 'unlink' && isProcessFile) {
          await unlink(resolve(nuxt.options.rootDir, path).replace(/\\/g, '/'))
        }
      })
    }

    if(nuxt.options._prepare) {
      await rm(outputFolder, { recursive: true, force: true })
      await Promise.all(endpoints.map(e => limit(() => executor(e))))

      await updateAllCache(endpoints, cacheFilePath)
    }

    // console.timeEnd('nuxt-api-generator')
    addImportsDir(['utils'].map(d => resolve(`./runtime/${d}`)))
  }
})

async function findEndpoints(apiDir: string, withCache = false) {
  let endpoints = await glob('**/*.(get|post|put|delete).ts', { cwd: apiDir, absolute: true })

  return withCache
    ? endpoints.filter(async e => _fileHashes!.get(e) !== (await hashFile(e)))
    : endpoints
}

async function extractTypesFromEndpoint(endpoint: string, project: Project, isUpdate?: boolean): Promise<[string, string]> {
  const result: [string, string] = ['', '']

  const sf = project.getSourceFile(endpoint) || project.addSourceFileAtPath(endpoint)

  if(isUpdate) {
    await sf.refreshFromFileSystem()
    project.resolveSourceFileDependencies()
  }

  const handler = sf.getExportAssignment((exp: ExportAssignment) => {
    const expression = exp.getExpressionIfKind(SyntaxKind.CallExpression)
    if (!expression) return false

    const identifier = expression.getExpressionIfKind(SyntaxKind.Identifier)
    return /^defineAdwancedEventHandler$/s.test(identifier?.getText() || '')
  })?.getExpressionIfKind(SyntaxKind.CallExpression)

  const getFinalType = (aliasSymbol: Symbol | undefined, resultType: 'payload' | 'response') => {
    const resultIndex = resultType === 'payload' ? 0 : 1

    if(aliasSymbol) {
      const aliasType = aliasSymbol?.getDeclarations().find(Node.isTypeAliasDeclaration)as TypeAliasDeclaration | undefined
      result[resultIndex] = aliasType?.getTypeNode()?.getText({ trimLeadingIndentation: true }).replace(/(\r\n|\n|\r)/gm, '') || 'unknown'
    }
    else {
      result[resultIndex] = handler?.getTypeArguments()[0].getText().replace(/(\r\n|\n|\r)/gm, '') || 'unknown'
    }

    if(result[resultIndex] === 'unknown') console.warn(`Can't find ${resultType} type for endpoint ${endpoint}, it will be unknown`)
  }

  const aliasSymbolPayload = handler?.getTypeArguments()[0].getType()?.getAliasSymbol()
  getFinalType(aliasSymbolPayload, 'payload')

  const arrow = handler?.getArguments()[0].asKindOrThrow(SyntaxKind.ArrowFunction)
  let payloadType = arrow?.getReturnType().getTypeArguments()[0]
  while (payloadType?.getSymbol()?.getName() === "Promise") {
    payloadType = payloadType.getTypeArguments()[0]
  }

  const aliasSymbolResponse = payloadType?.getAliasSymbol()
  getFinalType(aliasSymbolResponse, 'response')

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

async function readAllCache(file: string) {
  if(!existsSync(file)) return new Map()
  return new Map(Object.entries(JSON.parse(await readFile(file, 'utf8'))))
}

async function updateAllCache(endpoints: string[], outFile: string) {
  for(const e of endpoints) {
    const h = await hashFile(e)
    _fileHashes?.set(e, h)
  }

  await createFile(outFile, JSON.stringify(Array.from(_fileHashes!), null, 0))
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
