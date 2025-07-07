import { vol } from 'memfs'
import { extractTypesFromEndpoint, getEndpointStructure, constructComposableCode } from '../src/module'
import { beforeEach, describe, expect, it } from 'vitest'
import { resolve } from 'node:path'
import { Project } from 'ts-morph'
import { readFile } from 'node:fs/promises'
import { glob } from 'tinyglobby'

describe('Test type extraction and composable generation on small real world example', async () => {
  const apiDir = resolve(import.meta.dirname, '../playground/server/api').replace(/\\/g, '/')
  const outputDir = resolve(import.meta.dirname, '../node_modules/nuxt-apex/').replace(/\\/g, '/')
  const templateFile = resolve(import.meta.dirname, '../src/runtime/templates/fetch.txt').replace(/\\/g, '/')

  const serverHandler = 'defineApexHandler'
  const composableName = 'useTFetch'

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

  const endpoints = await (await glob(apiDir + '/**/*.(get|post|put|delete).ts', { cwd: apiDir, absolute: true })).map(e => e.replace(/\\/g, '/'))
  for (const endpoint of endpoints) {
    it(`generates a composable for endpoint: ${endpoint.split(apiDir)[1]}`, async () => {
      const et = await extractTypesFromEndpoint(endpoint, tsProject, serverHandler, false)
      const es = getEndpointStructure(endpoint, apiDir, 'api')
      const code = constructComposableCode(await readFile(templateFile, 'utf-8'), et, es, composableName)

      const path = resolve(outputDir, './composables', `${composableName + es.name}.ts`).replace(/\\/g, '/')
      vol.fromJSON({ [path]: code })

      expect(code).toMatchSnapshot()
    })
  }
})
