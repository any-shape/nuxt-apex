import { defineNuxtModule, createResolver } from '@nuxt/kit'
import { resolve, dirname } from 'node:path'
import { glob } from 'tinyglobby'
import { Project, SyntaxKind, Node, type ArrowFunction, type Type, type ExportAssignment, TypeAliasDeclaration } from 'ts-morph'
import { readFile, writeFile } from 'node:fs/promises'

export interface ApiGeneratorModuleOptions {
  /** Custom path to the Rust binary (optional) */
  sourcePath?: string
  /** Output filename under the Nuxt buildDir (default: 'api.ts') */
  outputPath?: string
}

type EndpointStructure = {
  path: string[],
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
    outputPath: 'api-generator/api.ts'
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const sourcePath = resolve(nuxt.options.serverDir, options.sourcePath!).replace(/\\/s, '/')
    const outFile = resolve(nuxt.options.buildDir, options.outputPath!).replace(/\\/s, '/')

    const endpoints = await findEndpoints(sourcePath)
    if (endpoints.length === 0) {
      return
    }

    // const project = new Project({
    //   tsConfigFilePath: resolve(nuxt.options.serverDir, 'tsconfig.json').replace(/\\/s, '/'),
    //   skipFileDependencyResolution: true,
    //   compilerOptions: {
    //     skipLibCheck: true,
    //     incremental: true,
    //   },
    // })
    // project.resolveSourceFileDependencies()

    for (const e of endpoints) {
      const structure = getEndpointStructure(e, options.sourcePath!)
      //const types = extractTypesFromEndpoint(project, e)


    }
    // console.log(types);


    const importDir = dirname(outFile)
    nuxt.options.imports = nuxt.options.imports || { dirs: [] }
    nuxt.options.imports.dirs?.push(importDir)
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
  const path = base.split('/').map(p => p.replace(/[|]/s, ''))

  const nameParts = path[path.length - 1].split('.')

  const method = nameParts[1] as keyof typeof d
  const name = /\[.+\]/s.test(nameParts[0])
    ? d[method] + 'By' + capitalize(nameParts[0].replaceAll(/\[|\]/g, ''))
    : nameParts[0]

  return {
    path: path.slice(0, -1),
    method,
    name
  }
}

async function createInnerApiFunction(structure: EndpointStructure, types: [string, string]) {

}

async function createApiFunction() {

}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
