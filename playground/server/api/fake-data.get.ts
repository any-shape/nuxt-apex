import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  return JSON.parse(await readFile(join(process.cwd(), 'server/api/fakeData.json'), 'utf8'))
})
