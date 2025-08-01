import { vol } from 'memfs'
import { extractTypesFromEndpoint, getEndpointStructure, constructComposableCode, DEFAULTS } from '../src/module'
import { beforeEach, describe, expect, it } from 'vitest'
import { resolve } from 'node:path'
import { Project } from 'ts-morph'
import { readFile } from 'node:fs/promises'
import { glob } from 'tinyglobby'

const root = process.cwd()
const apiDir = resolve(root, './playground/server', DEFAULTS.sourcePath).replace(/\\/g, '/')
const outputDir = resolve(root, './playground', DEFAULTS.outputPath).replace(/\\/g, '/')
const templateFile = resolve(root, './src/runtime/templates/fetch.txt').replace(/\\/g, '/')
const endpoints = (await glob(apiDir + '/**/*.(get|post|put|delete).ts', { cwd: apiDir, absolute: true })).map(e => e.replace(/\\/g, '/'))

describe('Test type extraction and composable code generation', () => {
  const tsProject = new Project({ tsConfigFilePath: resolve(apiDir, '../tsconfig.json').replace(/\\/g, '/'),
    skipFileDependencyResolution: true,
    compilerOptions: {
      skipLibCheck: true,
      allowJs: false,
      declaration: false,
      noEmit: true,
      preserveConstEnums: false,
    }
  })

  beforeEach(() => {
    vol.reset()
  })

  for (const endpoint of endpoints) {
    it(`generates a composable for endpoint: ${endpoint.split(apiDir)[1]}`, async () => {
      const et = await extractTypesFromEndpoint(endpoint, tsProject, DEFAULTS.serverEventHandlerName, false)
      const es = getEndpointStructure(endpoint, apiDir, DEFAULTS.sourcePath)
      const code = constructComposableCode(await readFile(templateFile, 'utf-8'), et, es, DEFAULTS.composablePrefix)

      const path = resolve(outputDir, './composables', `${DEFAULTS.composablePrefix + es.name}.ts`).replace(/\\/g, '/')
      vol.fromJSON({ [path]: code })

      expect(code).toMatchSnapshot()
    })
  }
})
