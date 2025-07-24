import { resolve } from 'node:path'
import { glob } from 'tinyglobby'

const root = process.cwd()
const apiDir = resolve(root, './playground/server/api').replace(/\\/g, '/')
const outputDir = resolve(root, './playground').replace(/\\/g, '/')
const templateFile = resolve(root, './src/runtime/templates/fetch.txt').replace(/\\/g, '/')
const endpoints = (await glob(apiDir + '/**/*.(get|post|put|delete).ts', { cwd: apiDir, absolute: true })).map(e => e.replace(/\\/g, '/'))

console.log(endpoints);
