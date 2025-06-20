import { defineNuxtModule, addImportsDir } from '@nuxt/kit'
import { resolve, normalize, dirname } from 'node:path'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { availableParallelism } from 'node:os'
import { Project, SyntaxKind, Node, type ExportAssignment, TypeAliasDeclaration } from 'ts-morph'
import { glob } from 'tinyglobby'
import pLimit from 'p-limit'

export interface ApiGeneratorModuleOptions {
  /** Custom path to the Rust binary (optional) */
  sourcePath?: string
  /** Output filename under the Nuxt buildDir (default: 'api.ts') */
  outputPath?: string,
  /** Composable name prefix (default: 'useTFetch') */
  composableName?: string
}

type EndpointStructure = {
  url: string,
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
    sourcePath: 'api/',
    outputPath: 'api-generator/composables',
    composableName: 'useTFetch',
  },
  async setup(options, nuxt) {
    const sourcePath = resolve(nuxt.options.serverDir, options.sourcePath!).replace(/\\/g, '/')

    const endpoints = await findEndpoints(sourcePath)
    if (endpoints.length === 0) {
      return
    }

    const project = getTsProject(resolve(nuxt.options.serverDir, 'tsconfig.json').replace(/\\/g, '/'))
    project.resolveSourceFileDependencies()
    const folder = resolve(nuxt.options.rootDir, 'node_modules/@nuxt-api-generator/composables')
    const limit = pLimit(availableParallelism() - 1 || 1)

    const executor = (e: string) => createApiFunction(
      folder,
      options.outputPath!,
      extractTypesFromEndpoint(e, project),
      getEndpointStructure(e, sourcePath)
    )

    await Promise.all(endpoints.map(e => limit(() => executor(e))))
    addImportsDir(folder)
  }
})

function getTsProject(tsConfigFilePath: string) {
  return _tsProject ??= new Project({
    tsConfigFilePath,
    skipFileDependencyResolution: true,
    skipAddingFilesFromTsConfig: true,
    skipLoadingLibFiles: true,
    compilerOptions: {
      skipLibCheck: true,
      allowJs: false,
      declaration: false,
      noEmit: true,
      preserveConstEnums: false
    },
  })
}

async function findEndpoints(apiDir: string) {
  return await glob('**/*.(get|post|put|delete).ts', { cwd: apiDir, absolute: true })
}

function extractTypesFromEndpoint(endpoint: string, project: Project): [string, string] {
  const result: [string, string] = ['', '']

  const handler = project
    .addSourceFileAtPath(endpoint)
    .getExportAssignment((exp: ExportAssignment) => {
      const expression = exp.getExpressionIfKind(SyntaxKind.CallExpression)
      if (!expression) return false

      const identifier = expression.getExpressionIfKind(SyntaxKind.Identifier)
      return /^defineAdwancedEventHandler$/s.test(identifier?.getText() || '')
    })?.getExpressionIfKind(SyntaxKind.CallExpression)

  const aliasSymbol = handler?.getTypeArguments()[0].getType()?.getAliasSymbol()
  const aliasType = aliasSymbol?.getDeclarations().find(Node.isTypeAliasDeclaration)as TypeAliasDeclaration | undefined
  result[0] = aliasType?.getTypeNode()?.getText({ trimLeadingIndentation: true }).replace(/(\r\n|\n|\r)/gm, '') || 'unknown'

  const arrow = handler?.getArguments()[0].asKindOrThrow(SyntaxKind.ArrowFunction)
  let payloadType = arrow?.getReturnType().getTypeArguments()[0]
  while (payloadType?.getSymbol()?.getName() === "Promise") {
    payloadType = payloadType.getTypeArguments()[0]
  }

  const aliasSym = payloadType?.getAliasSymbol()
  if (aliasSym) {
    const aliasDecl = aliasSym.getDeclarations().find(Node.isTypeAliasDeclaration) as TypeAliasDeclaration
    result[1] = aliasDecl.getTypeNode()?.getText({ trimLeadingIndentation: true }).replace(/(\r\n|\n|\r)/gm, '') || 'unknown'
  }
  else {
    result[1] = payloadType?.getText().replace(/(\r\n|\n|\r)/gm, '') || 'unknown'
  }

  return result
}

function getEndpointStructure(endpoint: string, sourcePath: string): EndpointStructure {
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
      : nameParts[0]

  return {
    url: normalize(sourcePath + '/' + path.slice(0, -1).map(p => {
      return /\[.+\]/s.test(p)
        ? '${' + p.replaceAll(/\[|\]/g, '') + '}'
        : p
    }).join('/')).replace(/\\/g, '/'),
    method,
    name: namePath + capitalize(name)
  }
}

async function createApiFunction(fileLocation: string, fileName: string, typesInfo: [string, string], endpointInfo: EndpointStructure) {
  const templateTFetch = await readFile(resolve(__dirname, 'runtime/templates/fetch.txt'), 'utf8')
  const fnCode = templateTFetch
    .replace(/:inputType/g, typesInfo[0])
    .replace(/:responseType/g, typesInfo[1])
    .replace(/:url/g, `'${endpointInfo.url}'`)
    .replace(/:method/g, `'${endpointInfo.method}'`)
    .replace(/:apiFnName/g, endpointInfo.name)
    .replace(/:inputData/g, ['get', 'delete'].includes(endpointInfo.method) ? 'params: data' : 'body: data')

  const file = resolve(fileLocation, `${fileName}${endpointInfo.name}.ts`).replace(/\\/g, '/')
  await createFile(file, fnCode)
}

async function createFile(path: string, content: string) {
  const dir = dirname(path)
  await mkdir(dir, { recursive: true })
  await writeFile(path, content)
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
