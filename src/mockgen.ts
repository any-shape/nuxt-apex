import { promises as fs } from 'fs'
import path, { basename } from 'path'
import PLimit from 'p-limit'

/**
 * Options for generating fake Nuxt 3 API endpoints
 */
export interface GenerateOptions {
  /** Root folder where files/directories will be created */
  targetDir: string
  /** Maximum nesting levels of dynamic segments */
  maxDepth: number
  /** Total count of endpoint files to generate */
  endpointCount: number
  /** Path (relative to targetDir) for a single shared types.ts file */
  typesFilename?: string
  /** Number of files to write in parallel */
  concurrency?: number
}

// Static pools for segment and type generation
const STATIC_SEGMENTS = [
  'users', 'posts', 'comments', 'orders', 'products',
  'categories', 'profiles', 'messages', 'settings', 'tags',
]
const SLUG_KEYS = [
  'id', 'user-id', 'post-id', 'order-id', 'category-id',
  'variant-id', 'slug', 'name', 'type', 'uid', 'pid', 'vid',
]

// Constraints for output literal generation
const OUTPUT_MAX_DEPTH = 8
const OUTPUT_MAX_PROPS = 10

// Counter for unique Input type names
let inputTypeCounter = 0

await generateFakeNuxtApi({
  targetDir: 'playground/server/api-500',
  maxDepth: 7,
  endpointCount: 500,
  typesFilename: 'types.d.ts',
  concurrency: 8,
})

/**
 * Generate fake Nuxt 3 API endpoints under targetDir
 */
export async function generateFakeNuxtApi(opts: GenerateOptions): Promise<void> {
  const {
    targetDir,
    maxDepth,
    endpointCount,
    typesFilename = 'types.d.ts',
    concurrency = 8,
  } = opts

  // Ensure root exists
  await fs.mkdir(targetDir, { recursive: true })

  // Create shared types.ts with header
  const typesPath = path.join(targetDir, typesFilename)
  await fs.writeFile(typesPath, generateTypesFileHeader(), 'utf8')

  // Parallel limiter
  const limit = PLimit(concurrency)
  let written = 0

  // Generate endpoints
  const tasks: Promise<void>[] = []
  for (let i = 0; i < endpointCount; i++) {
    tasks.push(
      limit(async () => {
        const depth = getRandomInt(1, maxDepth)
        const segments = buildRandomSegments(depth)

        const method = pickRandomMethod()

        const fileRelPath = path.join(...segments) + `.${method}.ts`
        const filePath = path.join(targetDir, fileRelPath)

        await fs.mkdir(path.dirname(filePath), { recursive: true })

        const inputTypeName = await registerInputType(typesPath)

        const outputLiteral = generateOutputLiteral(OUTPUT_MAX_DEPTH, OUTPUT_MAX_PROPS)

        const content = buildEndpointFile(inputTypeName, outputLiteral, targetDir)
        await fs.writeFile(filePath, content, 'utf8')

        written++
      })
    )
  }

  await Promise.all(tasks)
  console.log(`\nCompleted generating ${endpointCount} endpoints in ${targetDir}`)
}

/**
 * Header for the shared types.ts file
 */
function generateTypesFileHeader(): string {
  return `// Auto-generated types file\n\n`
}

/**
 * Build random path segments mixing static and dynamic slugs
 */
function buildRandomSegments(depth: number): string[] {
  const segments: string[] = []
  for (let i = 0; i < depth; i++) {
    if (Math.random() < 0.5) {
      // dynamic slug
      const key = SLUG_KEYS[getRandomInt(0, SLUG_KEYS.length - 1)]
      segments.push(`[${key}]`)
    } else {
      // static segment
      const seg = STATIC_SEGMENTS[getRandomInt(0, STATIC_SEGMENTS.length - 1)]
      segments.push(seg)
    }
  }
  return segments
}

/** Choose one of the four HTTP methods */
function pickRandomMethod(): 'get' | 'post' | 'put' | 'delete' {
  const methods = ['get', 'post', 'put', 'delete'] as const
  return methods[getRandomInt(0, methods.length - 1)]
}

/**
 * Append a new Input interface or type to types.ts and return its unique name
 */
async function registerInputType(typesPath: string): Promise<string> {
  inputTypeCounter++
  const typeName = `Input${inputTypeCounter}`
  const { kind, def } = generateInputTypeSpec()
  let content: string
  if (kind === 'interface') {
    content = `export interface ${typeName} ${def}\n\n`
  } else {
    content = `export type ${typeName} = ${def}\n\n`
  }
  await fs.appendFile(typesPath, content, 'utf8')
  return typeName
}

/** Decide type variant and definition */
function generateInputTypeSpec(): { kind: 'interface' | 'type'; def: string } {
  const r = Math.random()
  if (r < 0.4) {
    return { kind: 'interface', def: generateSimpleType() }
  } else if (r < 0.8) {
    return { kind: 'type', def: generateMediumType() }
  } else {
    return { kind: 'type', def: generateComplexType() }
  }
}

/** Decide type complexity and delegate */
function generateInputTypeDefinition(): string {
  const r = Math.random()
  if (r < 0.4) return generateSimpleType()
  if (r < 0.8) return generateMediumType()
  return generateComplexType()
}

/** Simple object with 2–3 props */
function generateSimpleType(): string {
  const count = getRandomInt(2, 3)
  const props = generateProps(count)
  return `{ ${props.join(' ')} }`
}

/** 3–6 props with union or intersection */
function generateMediumType(): string {
  const count = getRandomInt(3, 6)
  const props = generateProps(count)
  const half = Math.ceil(count / 2)
  const first = props.slice(0, half).join(' ')
  const second = props.slice(half).join(' ')
  const op = Math.random() < 0.5 ? '&' : '|'
  return `{ ${first} } ${op} { ${second} }`
}

/** Complex type using Omit and Partial */
function generateComplexType(): string {
  const count = getRandomInt(3, 8)
  const props = generateProps(count)
  const omitProp = props[getRandomInt(0, props.length - 1)].split(':')[0]
  const base = `{ ${props.join(' ')} }`
  const partialCount = getRandomInt(1, 3)
  const partial = `{ ${generateProps(partialCount).join(' ')} }`
  return `Omit<${base}, '${omitProp}'> & Partial<${partial}>`
}

/** Pick unique props from a predefined pool */
function generateProps(count: number): string[] {
  const pool = [
    'name:string;', 'title:string;', 'count:number;',
    'isActive:boolean;', 'createdAt:string;', 'updatedAt:string;',
    'email:string;', 'age:number;', 'status:string;', 'price:number;'
  ]
  const props: string[] = []
  const used = new Set<number>()
  while (props.length < count) {
    const idx = getRandomInt(0, pool.length - 1)
    if (!used.has(idx)) {
      used.add(idx)
      props.push(pool[idx])
    }
  }
  return props
}

/** Generate a random JS literal with nested objects/arrays */
function generateOutputLiteral(maxDepth: number, maxProps: number): string {
  return buildLiteralObject(maxDepth, maxProps)
}

/** Recursively build a JS object literal */
function buildLiteralObject(depthLeft: number, propsLeft: number): string {
  const count = getRandomInt(1, Math.min(3, propsLeft))
  const parts: string[] = []
  for (let i = 0; i < count; i++) {
    const key = `"${randomOutputKey(i)}"`
    const val = buildLiteralValue(depthLeft - 1, propsLeft - count)
    parts.push(`${key}: ${val}`)
  }
  return `{ ${parts.join(', ')} }`
}

/** Choose a literal value based on depth and randomness */
function buildLiteralValue(depthLeft: number, propsLeft: number): string {
  if (depthLeft > 0 && Math.random() < 0.4) {
    return buildLiteralObject(depthLeft, propsLeft)
  }
  if (depthLeft > 0 && Math.random() < 0.4) {
    const len = getRandomInt(1, 3)
    const items = Array.from({ length: len }, () => buildLiteralValue(depthLeft - 1, propsLeft))
    return `[ ${items.join(', ')} ]`
  }
  const r = Math.random()
  if (r < 0.3) return `"${Math.random().toString(36).substring(2, 8)}"`
  if (r < 0.6) return `${getRandomInt(0, 100)}`
  return `${Math.random() < 0.5}`
}

/** Generate a key name for output literals */
function randomOutputKey(idx: number): string {
  const keys = [
    'data', 'result', 'items', 'value',
    'info', 'details', 'meta', 'list',
    'records', 'payload',
  ]
  return keys[idx % keys.length] + (idx > 0 ? idx : '')
}

/** Template the endpoint file content */
function buildEndpointFile(inputTypeName: string, outputLiteral: string, targetDir: string): string {
  return `import {${inputTypeName}} from '~/server/${basename(targetDir)}/types'\nexport default defineAdwancedEventHandler<${inputTypeName}>(async (data) => {\n  return ${outputLiteral}\n})\n`
}

/** Random integer between min and max inclusive */
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
