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

    // Identify platform-specific Rust binary
    const platform = process.platform  // 'linux', 'darwin', 'win32'
    const arch = process.arch          // 'x64', 'arm64', etc.
    let binName = `api-gen-${platform}-${arch}`
    if (platform === 'win32') binName += '.exe'

    // Resolve binary path: user override or bundled in bin/
    const binPath = options.binaryPath
      ? resolver.resolve(options.binaryPath)
      : resolver.resolve('../../bin', binName)
    nuxt.options.dev ? logger.info(`[nuxt-api-generator-rust] Using binary: ${binPath}`) : ''

    // Determine final output file under Nuxt buildDir (.nuxt)
    const outFile = resolve(nuxt.options.buildDir, options.outputPath!)
    nuxt.options.dev ? logger.info(`Generating composable at: ${outFile}`) : ''

    // Function to invoke Rust generator
    const runGenerator = (watch: boolean) => {
      logger.info('[nuxt-api-generator-rust] Running generator...')

      const args = ['--output', outFile, watch ? '--watch' : '']
      const proc = spawn(binPath, args, { stdio: 'inherit' })

      proc.on('close', (code) => {
        if (code !== 0) {
          logger.error(
            `[nuxt-api-generator-rust] Generator exited with code ${code}`
          )
        } else {
          logger.success(
            '[nuxt-api-generator-rust] Generation complete'
          )
        }
      })
    }

    // On build: single-run. On dev: fast incremental via Rust's --watch
    // runGenerator(nuxt.options.dev)

    // Auto-import the generated composable from buildDir
    const importDir = dirname(outFile)
    nuxt.options.imports = nuxt.options.imports || { dirs: [] }
    nuxt.options.imports.dirs?.push(importDir)
  }
})
