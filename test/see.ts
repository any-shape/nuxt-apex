import { DEFAULTS } from '../src/module.ts'
import { resolve } from 'node:path'

const root = process.cwd()
const apiDir = resolve(root, './playground/server', DEFAULTS.sourcePath).replace(/\\/g, '/')
const outputDir = resolve(root, './playground', DEFAULTS.outputPath).replace(/\\/g, '/')
const templateFile = resolve(root, './src/runtime/templates/fetch.txt').replace(/\\/g, '/')

console.log(apiDir, outputDir, templateFile);
