import { defineNuxtModule, addImportsDir, addImports, createResolver } from '@nuxt/kit'
import { resolve, normalize, dirname, relative } from 'node:path'
import { mkdir, readFile, unlink, writeFile, rm } from 'node:fs/promises'
import { availableParallelism } from 'node:os'
import { Project, SyntaxKind, Node, type Symbol, type ExportAssignment, type ProjectOptions, TypeAliasDeclaration } from 'ts-morph'
import { glob } from 'tinyglobby'
import pLimit from 'p-limit'

export interface ApiGeneratorModuleOptions {
  /** Custom path to the Rust binary (optional) */
  sourcePath?: string
  /** Output filename under the Nuxt buildDir (default: 'api.ts') */
  outputPath?: string,
  /** Composable name prefix (default: 'useTFetch') */
  composableName?: string,
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

export default defineNuxtModule<ApiGeneratorModuleOptions>({
  meta: {
    name: 'nuxt-api-generator',
    configKey: 'apiGenerator'
  },
  defaults: {
    sourcePath: 'api',
    outputPath: 'nuxt-api-generator/composables',
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

    const endpoints = await findEndpoints(sourcePath)
    if (endpoints.length === 0) return

    const project = getTsProject({ tsConfigFilePath: resolve(nuxt.options.serverDir, 'tsconfig.json').replace(/\\/g, '/'), ...options.tsMorphOptions })

    const folder = resolve(nuxt.options.rootDir, `node_modules/@${options.outputPath}`).replace(/\\/g, '/')
    const limit = pLimit(availableParallelism() - 1 || 1)

    const executor = async (e: string, isUpdate?: boolean) => createApiFunction(
      folder,
      options.composableName!,
      await extractTypesFromEndpoint(e, project, isUpdate),
      getEndpointStructure(e, sourcePath, options.sourcePath!)
    )

    if(!nuxt.options._prepare && !nuxt.options._build) {
      nuxt.hook('builder:watch', async (event, path) => {
        const isProcessFile = path.includes(sourcePath.split('/').slice(-1*(options.sourcePath!.split('/').length + 1)).join('/')) && /\.(get|post|put|delete)\.ts$/s.test(path)

        if ((event === 'change' || event === 'add') && isProcessFile) {
          executor(resolve(nuxt.options.rootDir, path).replace(/\\/g, '/'), event === 'change')
        }
        else if(event === 'unlink' && isProcessFile) {
          await unlink(resolve(nuxt.options.rootDir, path).replace(/\\/g, '/'))
        }
      })
    }

    if(nuxt.options._prepare) {
      await rm(folder, { recursive: true, force: true })
      await Promise.all(endpoints.map(e => limit(() => executor(e))))
    }

    addImportsDir(['utils'].map(d => resolve(`./runtime/${d}`)))
    // console.timeEnd('nuxt-api-generator')
  }
})

function getTsProject(options: ProjectOptions) {
  return _tsProject ??= new Project(options)
}

async function findEndpoints(apiDir: string) {
  return await glob('**/*.(get|post|put|delete).ts', { cwd: apiDir, absolute: true })
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

  const aliasSymbol = handler?.getTypeArguments()[0].getType()?.getAliasSymbol()
  getFinalType(aliasSymbol, 'payload')

  const arrow = handler?.getArguments()[0].asKindOrThrow(SyntaxKind.ArrowFunction)
  let payloadType = arrow?.getReturnType().getTypeArguments()[0]
  while (payloadType?.getSymbol()?.getName() === "Promise") {
    payloadType = payloadType.getTypeArguments()[0]
  }

  const aliasSym = payloadType?.getAliasSymbol()
  getFinalType(aliasSym, 'response')

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

async function createApiFunction(fileLocation: string, namePrefix: string, typesInfo: [string, string], endpointInfo: EndpointStructure) {
  const templateTFetch = await readFile(resolve(__dirname, 'runtime/templates/fetch.txt'), 'utf8')
  const fnCode = templateTFetch
    .replace(/:inputType/g, typesInfo[0])
    .replace(/:responseType/g, typesInfo[1])
    .replace(/:url/g, `\`${endpointInfo.url}\``)
    .replace(/:method/g, `'${endpointInfo.method}'`)
    .replace(/:apiNamePrefix/g, namePrefix)
    .replace(/:apiFnName/g, endpointInfo.name)
    .replace(
      /:inputData/g,
      (['get', 'delete'].includes(endpointInfo.method) ? 'params' : 'body') + `: apiGenOmit(data, ${JSON.stringify(endpointInfo.slugs)})`
    )

  const fileName = namePrefix + endpointInfo.name
  const path = resolve(fileLocation, `${fileName}.ts`).replace(/\\/g, '/')
  await createFile(path, fnCode)

  addImports([
    { name: fileName, as: fileName, from: path },
    { name: fileName+'Async', as: fileName+'Async', from: path }
  ])
}

async function createFile(path: string, content: string) {
  const dir = dirname(path)
  await mkdir(dir, { recursive: true })
  await writeFile(path, content)
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
