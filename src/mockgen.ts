import { promises as fs } from 'fs'
import { dirname, join, relative, resolve } from 'path'
import PLimit from 'p-limit'
import { getEndpointStructure, DEFAULTS } from './module.ts'


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

type UtilSpec = {
  file: string,
  name: string,
  staticMapping: any
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
  targetDir: 'playground/server/api',
  maxDepth: 5,
  endpointCount: 25,
  typesFilename: 'types.d.ts',
  concurrency: 20,
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

  await fs.rm(targetDir, { recursive: true, force: true })
  await fs.mkdir(targetDir, { recursive: true })

  // Create shared types.ts with header
  const typesPath = join(targetDir, typesFilename)
  await fs.writeFile(typesPath, generateTypesFileHeader(), 'utf8')

  // Setup utils functions (15% of endpoints)
  const utilSpecs = await setupUtils(targetDir, endpointCount);

  // Collect return mapping
  const returnMapping: Record<string, any> = {};

  // Track which slug keys are used per parent directory to avoid multiple slug siblings
  const slugUsage = new Map<string, string>()

  // Parallel limiter
  const limit = PLimit(concurrency)
  let written = 0

  // Generate endpoints
  const tasks: Promise<void>[] = []
  for (let i = 0; i < endpointCount; i++) {
    tasks.push(
      limit(async () => {
        const depth = getRandomInt(1, maxDepth)

        const segments: string[] = []
        let parentPath = ''
        for (let i = 0; i < depth; i++) {
          if (Math.random() < 0.5) {
            let key: string
            if (slugUsage.has(parentPath)) {
              key = slugUsage.get(parentPath)!
            } else {
              key = SLUG_KEYS[getRandomInt(0, SLUG_KEYS.length - 1)]
              slugUsage.set(parentPath, key)
            }
            segments.push(`[${key}]`)
          } else {
            const seg = STATIC_SEGMENTS[getRandomInt(0, STATIC_SEGMENTS.length - 1)]
            segments.push(seg)
          }
          parentPath = parentPath ? `${parentPath}/${segments[i]}` : segments[i]
        }

        const slugKeys = segments.filter(s=>/^\[.*\]$/.test(s)).map(s=>s.slice(1,-1))
        const method = pickRandomMethod()

        const fileRel = join(...segments) + `.${method}.ts`
        const filePath = join(targetDir, fileRel)

        await fs.mkdir(dirname(filePath), { recursive: true })

        const [inputTypeName, payload] = await registerInputType(typesPath, slugKeys)

        // Decide on util usage
        let content: string
        let mappingValue: any
        const useUtil = utilSpecs.length > 0 && Math.random() < 0.15

        content = !/^{.+}$|^Omit<{.+}>$/g.test(inputTypeName) ? `import {${inputTypeName}} from \'~/server/api/types.d\';\n` : ''

        if (useUtil) {
          const spec = utilSpecs[getRandomInt(0, utilSpecs.length - 1)]
          const relImport = './' + relative(dirname(filePath), spec.file).replace(/\\/g, '/').replace(/\.ts$/, '');

          content +=
            `import { ${spec.name} } from '${relImport}';\n\n` +
            `export default ${DEFAULTS.serverEventHandlerName}<${inputTypeName}>(async (data) => {\n` +
            `  return ${spec.name}(data);\n` +
            `});\n`
          mappingValue = spec.staticMapping
        }
        else {
          const outputLiteral = generateOutputLiteral(OUTPUT_MAX_DEPTH, OUTPUT_MAX_PROPS)

          content +=
            `export default ${DEFAULTS.serverEventHandlerName}<${inputTypeName}>(async (data) => {\n` +
            `  return ${outputLiteral};\n` +
            `});\n`
          // Evaluate the literal to get an object
          mappingValue = eval(`(${outputLiteral})`)
        }

        // Write endpoint file
        await fs.writeFile(filePath, content, 'utf8');
        written++;

        const { name } = getEndpointStructure(resolve(filePath).replace(/\\/g, '/'), resolve(targetDir).replace(/\\/g, '/'), 'api')
        returnMapping[name] = { payload, response: mappingValue };

        console.log(`Writing ${written}/${endpointCount}: ${fileRel}`);
      })
    );
  }

  await Promise.all(tasks);

  const mapPath = join(targetDir, 'fakeData.json')
  await fs.writeFile(mapPath, JSON.stringify(returnMapping, null, 2), 'utf8')

  console.log(`\nCompleted generating ${endpointCount} endpoints (incl. utils) in ${ targetDir }`)
}

/**
 * Setup util files under targetDir/utils
 */
async function setupUtils(targetDir: string, endpointCount: number): Promise<UtilSpec[]> {
  const totalUtils = Math.ceil(endpointCount * 0.15);
  if (totalUtils <= 0) return [];

  const utilCount = Math.min(3, totalUtils);
  const perFile = Math.ceil(totalUtils / utilCount);
  const specs: UtilSpec[] = [];
  const utilsDir = join(targetDir, 'utils');
  await fs.mkdir(utilsDir, { recursive: true });

  let counter = 0;
  for (let i = 1; i <= utilCount; i++) {
    const file = join(utilsDir, `utils${i}.ts`);
    let buf = `// Auto-generated utils\n\n`;

    for (let j = 0; j < perFile && counter < totalUtils; j++) {
      counter++;
      const name = `randomData${counter}`;
      const keyCount = getRandomInt(1, 3);
      const keys = pickRandomUnique(SLUG_KEYS, keyCount);
      const staticCode = generateOutputLiteral(2, 5);
      const staticObj = eval(`(${staticCode})`);
      const staticMapping = {
        ...Object.fromEntries(keys.map((k) => [k, k])),
        ...staticObj,
      };

      buf += `export function ${name}(data: any) {\n`;
      buf += `  return { ${keys.map((k) => `'${k}': data['${k}']`).join(', ') }, ...${staticCode} };\n`;
      buf += `}\n\n`;

      specs.push({ file, name, staticMapping });
    }

    await fs.writeFile(file, buf, 'utf8');
  }

  return specs;
}

/**
 * Header for the shared types.ts file
 */
function generateTypesFileHeader(): string {
  return `// Auto-generated types file\n\n`
}

function pickRandomUnique(arr: string[], count: number): string[] {
  const out: string[] = [];
  const used = new Set<number>();

  while (out.length < count) {
    const i = getRandomInt(0, arr.length - 1);
    if (!used.has(i)) {
      used.add(i);
      out.push(arr[i]);
    }
  }

  return out;
}

/** Choose one of the four HTTP methods */
function pickRandomMethod(): 'get' | 'post' | 'put' | 'delete' {
  const methods = ['get', 'post', 'put', 'delete'] as const
  return methods[getRandomInt(0, methods.length - 1)]
}

/**
 * Append a new Input interface or type to types.ts and return its unique name
 */
async function registerInputType(typesPath: string, slugKeys: string[]): Promise<[string, string]> {
  inputTypeCounter++
  const typeName = `Input${inputTypeCounter}`
  const { kind, def } = generateInputTypeSpec(slugKeys)
  let content: string
  if (kind === 'interface') {
    content = `export interface ${typeName} ${def}\n\n`
  } else {
    content = `export type ${typeName} = ${def}\n\n`
  }
  await fs.appendFile(typesPath, content, 'utf8')

  const payload = generateFakePayload(def)
  return [typeName, payload]
}

/**
 * Generate a fake payload from a TS type definition string
 */
function generateFakePayload(def: string): any {
  const payload: any = {};
  const regex = new RegExp('([A-Za-z0-9_]+)\s*:\s*(string|number|boolean);','g');
  let match;
  while ((match = regex.exec(def)) !== null) {
    const [, key, type] = match;
    if (type === 'string') payload[key] = Math.random().toString(36).substring(2, 8);
    else if (type === 'number') payload[key] = getRandomInt(0, 100);
    else if (type === 'boolean') payload[key] = Math.random() < 0.5;
  }
  return payload;
}

/** Decide type variant and definition */
function generateInputTypeSpec(slugKeys: string[]): { kind: 'interface' | 'type'; def: string } {
  const r = Math.random()
  const slugs =  slugKeys.length ? '{'+slugKeys.map(k => `'${k}': string`).join()+'}&' : ''

  if (r < 0.4) {
    return { kind: 'interface', def: generateSimpleType(slugKeys) }
  } else if (r < 0.8) {
    return { kind: 'type', def: slugs + generateMediumType() }
  } else {
    return { kind: 'type', def: slugs + generateComplexType() }
  }
}

/** Simple object with 2–3 props */
function generateSimpleType(slugKeys: string[]): string {
  const count = getRandomInt(2, 3)
  const props = [...generateProps(count), ...slugKeys.map(k => `'${k}': string;`)]
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

/** Random integer between min and max inclusive */
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
