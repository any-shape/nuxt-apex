import { defineNuxtModule, createResolver, addTemplate, addImports, addImportsDir } from '@nuxt/kit'
import { resolve, normalize, dirname, join, relative } from 'node:path'
import { glob } from 'tinyglobby'
import { Project, SyntaxKind, Node, type ExportAssignment, TypeAliasDeclaration } from 'ts-morph'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

export interface ApiGeneratorModuleOptions {
  /** Custom path to the Rust binary (optional) */
  sourcePath?: string
  /** Output filename under the Nuxt buildDir (default: 'api.ts') */
  outputPath?: string,
  /** Composable names (default: 'useTFetch' and 'useTFetchAsync') */
  composableNames?: {
    tFetch: string,
    tFetchAsync: string
  }
}

type EndpointStructure = {
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  name: string
}

export default defineNuxtModule<ApiGeneratorModuleOptions>({
  meta: {
    name: 'nuxt-api-generator',
    configKey: 'apiGenerator'
  },
  defaults: {
    sourcePath: 'api/',
    outputPath: 'api-generator/composables',
    composableNames: {
      tFetch: 'useTFetch',
      tFetchAsync: 'useTFetchAsync'
    }
  },
  async setup(options, nuxt) {
    const sourcePath = resolve(nuxt.options.serverDir, options.sourcePath!).replace(/\\/s, '/')

    const endpoints = await findEndpoints(sourcePath)
    if (endpoints.length === 0) {
      return
    }

    const project = new Project({
      tsConfigFilePath: resolve(nuxt.options.serverDir, 'tsconfig.json').replace(/\\/s, '/'),
      skipFileDependencyResolution: true,
      compilerOptions: {
        skipLibCheck: true,
        incremental: true,
      },
    })
    project.resolveSourceFileDependencies()
    const folder = resolve(nuxt.options.rootDir, 'node_modules/@nuxt-api-generator/composables')

    for (const e of endpoints) {
      const structure = getEndpointStructure(e, options.sourcePath!)
      const types = extractTypesFromEndpoint(project, e)

      await createApiFunction(folder, options.composableNames!, types, structure)
    }

    addImportsDir(folder)
  }
})

async function findEndpoints(apiDir: string) {
  return await glob('**/*.(get|post|put|delete).ts', { cwd: apiDir, absolute: true })
}

function extractTypesFromEndpoint(project: Project, endpoint: string): [string, string] {
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

async function createApiFunction(fileLocation: string, fileNames: { tFetch: string, tFetchAsync: string }, typesInfo: [string, string], endpointInfo: EndpointStructure) {
  const templateTFetch = await readFile(resolve(__dirname, 'runtime/templates/use-fetch-with-types.txt'), 'utf8')
  const fnCode = templateTFetch
    .replace(/:inputType/g, typesInfo[0])
    .replace(/:responseType/g, typesInfo[1])
    .replace(/:url/g, `'${endpointInfo.url}'`)
    .replace(/:method/g, `'${endpointInfo.method}'`)
    .replace(/:apiFnName/g, endpointInfo.name)
    .replace(/:inputData/g, ['get', 'delete'].includes(endpointInfo.method) ? 'params: data' : 'body: data')

  const file = resolve(fileLocation, `${fileNames.tFetch}${endpointInfo.name}.ts`).replace(/\\/g, '/')
  await createFile(file, fnCode)
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function createFile(path: string, content: string) {
  const dir = dirname(path)
  await mkdir(dir, { recursive: true })
  await writeFile(path, content)
}
