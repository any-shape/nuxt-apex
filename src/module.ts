import { defineNuxtModule, addImportsDir, addImports, createResolver, addServerImportsDir } from '@nuxt/kit'
import { normalize, dirname, join, basename } from 'node:path'
import { mkdir, readFile, unlink, writeFile, rm, rename, access } from 'node:fs/promises'
import { Project, SyntaxKind, Node, type Symbol, type ProjectOptions, TypeAliasDeclaration, InterfaceDeclaration, CallExpression, FunctionDeclaration, FunctionExpression, ArrowFunction, ReturnStatement, ImportTypeNode, ts } from 'ts-morph'
import { glob } from 'tinyglobby'
import pLimit from 'p-limit'
import xxhash from 'xxhash-wasm'
import storage from 'node-persist'
import { existsSync } from 'node:fs'
import { info, error, success, warn } from './logger.ts'


export interface ApexModuleOptions {
  /** Custom path to the source files (default: 'api') */
  sourcePath: string
  /** Output path (default: 'node_modules/.nuxt-apex/composables') */
  outputPath: string,
  /** Composable name prefix (default: 'useTFetch') */
  composableName: string,
  /** @see https://ts-morph.com/setup/ */
  tsMorphOptions: ProjectOptions,
  /**When true, the module will listen for changes in the source files and re-generate the composables (default: true) */
  listenFileDependenciesChanges: boolean,
/**The name of the server event handler (default: 'defineApexHandler')  */
  serverEventHandlerName: string,
  /** The path to the tsconfig.json file */
  tsConfigFilePath?: string,
  /** Ignore endpoints by relative path, e.g. api/some-endpoint.ts (default: []) */
  ignore?: string[],
  /** The path to the cache folder */
  cacheFolder?: string,
  /** The concurrency limit for generating composables (default: 50) */
  concurrency?: number
}

type EndpointStructure = {
  url: string,
  slugs: string[],
  method: 'get' | 'post' | 'put' | 'delete',
  name: string
}

type EndpointTypeStructure = {
  inputType: string,
  inputFilePath: string,
  responseType: string,
  responseFilePath: string
}

export const DEFAULTS = {
  sourcePath: 'api',
  outputPath: 'composables/.nuxt-apex',
  cacheFolder: 'composables/.nuxt-apex',
  composableName: 'useTFetch',
  listenFileDependenciesChanges: true,
  serverEventHandlerName: 'defineApexHandler',
  tsConfigFilePath: undefined,
  ignore: [],
  concurrency: 50,
  tsMorphOptions: {
    skipFileDependencyResolution: true,
    compilerOptions: {
      skipLibCheck: true,
      allowJs: false,
      declaration: false,
      noEmit: true,
      preserveConstEnums: false,
    },
  }
}

const _fileGenIds = new Map<string, number>()
const { h64Raw } = await xxhash()

export default defineNuxtModule<ApexModuleOptions>({
  meta: {
    name: 'nuxt-apex',
    configKey: 'apex'
  },
  defaults: DEFAULTS,
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const tsConfigFilePath = (DEFAULTS.tsConfigFilePath || resolve(nuxt.options.serverDir, 'tsconfig.json')).replace(/\\/g, '/')
    if(!existsSync(tsConfigFilePath)) {
      warn(`tsconfig.json not found in ${nuxt.options.serverDir}. Skipping...`)
      return
    }

    const tsProject = new Project({ tsConfigFilePath, ...options.tsMorphOptions })
    const composableTemplate = await readFile(resolve('./runtime/templates/fetch.txt'), 'utf8')

    const outputFolder = resolve(nuxt.options.rootDir, `${options.outputPath}/composables`).replace(/\\/g, '/')
    const sourcePath = resolve(nuxt.options.serverDir, options.sourcePath).replace(/\\/g, '/')
    if(!await isFolderExists(sourcePath)) {
      error(`Source path "${sourcePath}" doesn't exist`)
      return
    }

    await storage.init({ dir: resolve(nuxt.options.rootDir, `${options.cacheFolder}/storage`).replace(/\\/g, '/'), encoding: 'utf-8' })
    const limit = pLimit(options.concurrency || 50)

    const executor = async (e: string, isUpdate?: boolean, silent: boolean = true) =>  {
      try {
        const id = (_fileGenIds.get(e) || 0) + 1
        _fileGenIds.set(e, id)

        const et = await extractTypesFromEndpoint(e, tsProject, options.serverEventHandlerName, isUpdate)
        const es = getEndpointStructure(e, sourcePath, options.sourcePath)
        const code = constructComposableCode(composableTemplate, et, es, options.composableName)

        const fileName = options.composableName + es.name
        const path = resolve(outputFolder, `${fileName}.ts`).replace(/\\/g, '/')

        if(_fileGenIds.get(e) !== id) return
        await createFile(path, code)

        await storage.setItem(e, { c: path, hash: await hashFile(e), et })
        if(!silent) success(`Successfully ${isUpdate ? 'updated' : 'generated'} ${fileName} fetcher`)

        return true
      }
      catch (err) {
        throw new Error(`${err} for file ${e}`)
      }
    }

    const executeMany = async (endpoints: string[], isUpdate: boolean = false, isSilent: boolean = true) => {
      const result = await Promise.allSettled(endpoints.map(e => limit(() => executor(e, isUpdate, isSilent))))

      const fulfilled = result.filter(r => r.status === 'fulfilled').map(r => r.value!)
      if(fulfilled.length) success(`Generated ${fulfilled.length} endpoints`)

      const errors = result.filter(r => r.status === 'rejected').map(r => r.reason)
      if(errors.length) error(`Errors during generation ${errors.length}:`)
      for(const err of errors) error(err)
    }

    const endpoints = await findEndpoints(sourcePath, options.ignore?.map(x => '!' + resolve(nuxt.options.serverDir, x).replace(/\\/g, '/')))

    if(endpoints.length > 0) {
      await executeMany(endpoints)
    }

    if(!nuxt.options._prepare && !nuxt.options._build) {
      info('The endpoint change watcher has started successfully')

      nuxt.hook('builder:watch', async (event, path) => {
        const isProcessFile = path.includes(sourcePath.split('/').slice(-1 * (options.sourcePath!.split('/').length + 1)).join('/')) && /\.(get|post|put|delete)\.ts$/s.test(path)
        const endpoint = resolve(nuxt.options.rootDir, path).replace(/\\/g, '/')

        if(options.listenFileDependenciesChanges) {
          const reversableRelated = (await storage.data()).filter(x => {
            const u = x.value.et
            return u.inputFilePath === endpoint || u.responseFilePath === endpoint
          }).map(x => x.key)

          if(event === 'change' && reversableRelated.length) {
            await executeMany(reversableRelated, false, false)
            return
          }
        }

        if((event === 'change' || event === 'add') && isProcessFile) {
          try {
            await executor(endpoint, event === 'change', false)
          }
          catch (err) {
            error(`Error during generation: ${(err as Error).message}`)
          }
        }
        else if(event === 'unlink' && isProcessFile) {
          try {
            await unlink((await storage.getItem(endpoint)).c)
            await storage.removeItem(endpoint)
          }
          catch (err) {
            error(`Error during deletion: ${(err as Error).message}`)
          }
        }
      })
    }

    addImportsDir([outputFolder, resolve('runtime/utils'), resolve('runtime/composables')], { prepend: true })
    addServerImportsDir([resolve('runtime/server/utils')], { prepend: true })
  }
})

async function findEndpoints(apiDir: string, ignoreEndpoints: string[] = []) {
  const endpoints = await glob(['**/*.(get|post|put|delete).ts', ...ignoreEndpoints], { cwd: apiDir, absolute: true })
  return await compareWithStore(endpoints)
}

export async function extractTypesFromEndpoint(endpoint: string, tsProject: Project, handlerName: string, isUpdate?: boolean): Promise<EndpointTypeStructure> {
  const result: EndpointTypeStructure = {
    inputType: 'unknown',
    inputFilePath: 'unknown',
    responseType: 'unknown',
    responseFilePath: 'unknown'
  }

  const sf = tsProject.getSourceFile(endpoint) || tsProject.addSourceFileAtPath(endpoint)

  if(isUpdate) {
    for (const r of (await getRelatedFiles(endpoint)).filter(r => r !== endpoint)) {
      const rsf = tsProject.getSourceFile(r)
      if(rsf) tsProject.removeSourceFile(rsf) && tsProject.addSourceFileAtPath(r)
    }

    await sf.refreshFromFileSystem()
    tsProject.resolveSourceFileDependencies()
  }

  const handlerCall = sf.getExportAssignment(exp => {
    const expression = exp.getExpressionIfKind(SyntaxKind.CallExpression)
    if (!expression) return false

    const id = expression.getExpressionIfKind(SyntaxKind.Identifier)
    return !!id && new RegExp(handlerName, 's').test(id?.getText() || '')
  })?.getExpressionIfKind(SyntaxKind.CallExpression)

  if (!handlerCall) {
    throw new Error(`No ${handlerName} found in ${endpoint}`)
  }

  function getAliasText(sym: Symbol) {
    sym = sym.getAliasedSymbol?.() ?? sym
    const decl = sym?.getDeclarations().find(d => Node.isTypeAliasDeclaration(d) || Node.isInterfaceDeclaration(d)) as TypeAliasDeclaration | InterfaceDeclaration | undefined
    if(!decl) return 'unknown'

    const typeNode = Node.isTypeAliasDeclaration(decl) ? decl.getTypeNode() : decl
    const text = typeNode ? typeNode?.getText({ trimLeadingIndentation: true }).replace(/\s+/gm, '') : sym.getName()
    return text.includes('exportinterface') ? '{'+text.replace(/^exportinterface\w+{/s, '') : text
  }

  function getAliasFile(sym: Symbol) {
    sym = sym.getAliasedSymbol?.() ?? sym
    const decl = sym.getDeclarations().find(d => Node.isTypeAliasDeclaration(d) || Node.isInterfaceDeclaration(d))
    return decl ? decl.getSourceFile().getFilePath() : 'unknown'
  }

  function getCallDeclFile(callExpr: CallExpression) {
    const id = callExpr.getExpressionIfKindOrThrow(SyntaxKind.Identifier);
    const [decl] = id.getDefinitions().map(d => d.getDeclarationNode()).filter(Boolean) as Node[]
    if (!decl) return 'unknown'

    let filePath = decl.getSourceFile().getFilePath().toString()
    if(filePath.endsWith('.d.ts')) {
      const importType = decl.getFirstDescendantByKind(SyntaxKind.ImportType) as ImportTypeNode | undefined

      if (importType) {
        const moduleSpecifier = importType.getArgument().getText().replace(/['"]+/g, '')
        const baseDir = dirname(decl.getSourceFile().getFilePath())

        const candidate = join(baseDir, moduleSpecifier)
        if(existsSync(candidate + '.ts')) {
          filePath = candidate + '.ts'
        }
        else if(existsSync(join(candidate, 'index.ts'))) {
          filePath = join(candidate, 'index.ts')
        }
        else {
          filePath = candidate
        }
      }
    }

    filePath = filePath.replace(/\\/g, '/')

    let fnNode: FunctionDeclaration | FunctionExpression | ArrowFunction | undefined
    if(Node.isFunctionDeclaration(decl) || Node.isFunctionExpression(decl) ||  Node.isArrowFunction(decl)) {
      fnNode = decl
    }
    else if(Node.isVariableDeclaration(decl)) {
      const init = decl.getInitializer()
      if(Node.isFunctionExpression(init) || Node.isArrowFunction(init)) {
        fnNode = init
      }
    }

    if(!fnNode) return filePath

    const returns = fnNode.getDescendantsOfKind(SyntaxKind.ReturnStatement) as ReturnStatement[]
    for(const ret of returns) {
      const expr = ret.getExpression()
      if(expr && Node.isCallExpression(expr)) {
        return getCallDeclFile(expr)
      }
    }

    return filePath
  }

  //extract payload type and filepath
  const [payloadArg] = handlerCall.getTypeArguments()
  const payloadAlias = payloadArg.getType().getAliasSymbol() ?? payloadArg.getType().getSymbol()

  result.inputType = payloadAlias ? getAliasText(payloadAlias) : payloadArg.getText().replace(/\s+/gm, '')
  result.inputFilePath = payloadAlias ? getAliasFile(payloadAlias) : sf.getFilePath()

  //extract response type and filepath
  const arrow = handlerCall?.getArguments()[0].asKindOrThrow(SyntaxKind.ArrowFunction)

  let responseType = arrow.getSignature().getReturnType()
  while (responseType.getSymbol()?.getName() === "Promise") {
    const args = responseType.getTypeArguments()
    if (args.length === 0) break
    responseType = args[0]
  }

  result.responseType = responseType.getText().replace(/\s+/gm, '')

  let firstCall: CallExpression | undefined;
  if (Node.isCallExpression(arrow.getBody())) {
    firstCall = arrow.getBody() as CallExpression
  }
  else {
    const ret = arrow.getBody().getDescendantsOfKind(SyntaxKind.ReturnStatement)[0]
    const expr = ret?.getExpression()

    if (expr && Node.isCallExpression(expr)) {
      firstCall = expr
    }
  }

  result.responseFilePath = firstCall? getCallDeclFile(firstCall) : sf.getFilePath()
  return result
}

export function getEndpointStructure(endpoint: string, sourcePath: string, baseUrl: string): EndpointStructure {
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
  const url = '/' + normalize(baseUrl + '/' + path.map(p => {
    p = /.(get|post|put|delete)/s.test(p) ? p.split('.')[0] : p

    if(/\[.+\]/s.test(p)) {
      const slug = p.replaceAll(/\[|\]/g, '')
      slugs.push(slug)

      return `\${encodeURIComponent(data.${slug})}`
    }
    else return p
  }).join('/')).replace(/\\/g, '/')

  return {
    url,
    slugs,
    method,
    name: (namePath + capitalize(name)).split('-').map((x, i) => { if(i === 0) return x; return capitalize(x); }).join('')
  }
}

export function constructComposableCode(template: string, et: EndpointTypeStructure, es: EndpointStructure, composableName: string) {
  const dataText = es.slugs.length
   ? `:omit(data, ${es.slugs.map(x => `'${x}'`).join(',')})`
   : ':data'

  return template
    .replace(/:inputType/g, et.inputType)
    .replace(/:responseType/g, et.responseType)
    .replace(/:url/g, `\`${es.url}\``)
    .replace(/:method/g, `'${es.method}'`)
    .replace(/:apiNamePrefix/g, composableName)
    .replace(/:apiFnName/g, es.name)
    .replace(
      /:inputData/g,
      (['get', 'delete'].includes(es.method) ? 'query' : 'body') + dataText
    )
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

async function getRelatedFiles(endpoint: string) {
  return await storage.getItem(endpoint).then(({ et }) => [ et.inputFilePath, et.responseFilePath ] as string[])
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
  return s.charAt(0).toUpperCase() + s.slice(1)
}
