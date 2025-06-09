// src/index.ts
import { defineNuxtModule, createResolver, useLogger } from '@nuxt/kit'
import { spawn } from 'node:child_process'
import { resolve, dirname } from 'path'

export interface ApiGeneratorModuleOptions {
  /** Custom path to the Rust binary (optional) */
  binaryPath?: string
  /** Output filename under the Nuxt buildDir (default: 'api.ts') */
  outputPath?: string
}

export default defineNuxtModule<ApiGeneratorModuleOptions>({
  meta: {
    name: 'nuxt-api-generator-rust',
    configKey: 'apiGenerator'
  },
  defaults: {
    binaryPath: undefined,
    outputPath: 'api-generator/api.ts'
  },
  setup(options, nuxt) {
    const logger = useLogger('nuxt-api-generator-rust')
    const resolver = createResolver(import.meta.url)

    const platform = process.platform
    const arch = process.arch
    let binName = `api-gen-${platform}-${arch}`
    if (platform === 'win32') binName += '.exe'

    const binPath = options.binaryPath
      ? resolver.resolve(options.binaryPath)
      : resolver.resolve('../../bin', binName)
    nuxt.options.dev ? logger.info(`[nuxt-api-generator-rust] Using binary: ${binPath}`) : ''

    const outFile = resolve(nuxt.options.buildDir, options.outputPath!).replace(/\\/g, '/')
    nuxt.options.dev ? logger.info(`Generating composable at: ${outFile}`) : ''

    logger.info('[nuxt-api-generator-rust] Running generator...')

    const args = ['--source', nuxt.options.serverDir + '/api',  '--output', outFile, nuxt.options.dev ? '--watch' : undefined].filter(Boolean)
    // const proc = spawn(binPath, args, { stdio: 'inherit' })

    // 'C:/Users/Antony/Documents/coding/nuxt-api-generator/playground/server/api',
    // 'C:/Users/Antony/Documents/coding/nuxt-api-generator/playground/.nuxt/api-generator/api.ts',

    // proc.on('close', (code) => {
    //   if (code !== 0) {
    //     logger.error(
    //       `[nuxt-api-generator-rust] Generator exited with code ${code}`
    //     )
    //   } else {
    //     logger.success(
    //       '[nuxt-api-generator-rust] Generation complete'
    //     )
    //   }
    // })

    const importDir = dirname(outFile)
    nuxt.options.imports = nuxt.options.imports || { dirs: [] }
    nuxt.options.imports.dirs?.push(importDir)
  }
})
