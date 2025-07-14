import { EventHandler, EventHandlerRequest, EventHandlerResponse, H3Event, isError } from 'h3'
type ApexEventHandler<D> = (data: D, event: H3Event<EventHandlerRequest>) => EventHandlerResponse

export function defineApexHandler<Data = unknown, Req extends EventHandlerRequest = EventHandlerRequest>(handler: ApexEventHandler<Data>): EventHandler<Req> {
  return defineEventHandler<Req>(async (event) => {
    try {
      const data = await useData<Data>()
      return await handler(data, event)
    } catch (error: any) {
      if (isError(error)) throw error
      throw createError({ message: error.message, statusCode: error.statusCode || 500 })
    }
  })
}

export async function useData<Payload>() {
  const e = useEvent()
  const paramsInfo = getRouterParams(e)

  const hasBody = ['POST','PUT','PATCH','DELETE'].includes(e.method)
  const bodyInfo =  hasBody ? await readBody<Record<string, unknown>>(e) : {}

  const queryInfo = getQuery(e)

  const intersected = arrayIntersectionMany(Object.keys(paramsInfo), Object.keys(bodyInfo), Object.keys(queryInfo))
  if(intersected.length > 0)
    throw createError({ statusMessage: `Duplicate keys ${intersected} in params/query/body object`, statusCode: 500 })

  const merged = { ...paramsInfo, ...bodyInfo, ...queryInfo }

  return convertValues(merged, 'number') as Payload
}

function convertValues(value: any, modificator: 'number' | 'escape'): any {
  if (Array.isArray(value)) {
    return value.map(x => convertValues(x, modificator))
  } else if (value !== null && typeof value === 'object') {
    const result: Record<string, any> = {}
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = convertValues(value[key], modificator)
      }
    }
    return result
  } else if (typeof value === 'string') {
    if (modificator === 'number') {
      const trimmed = value.trim()
      if (trimmed === '') {
        return null
      }
      if (/^-?(?:\d+|\d*\.\d+)$/.test(trimmed)) {
        return Number(trimmed)
      }
    }
    if(modificator === 'escape') {
      return escape(value)
    }
  }
  else if (typeof value === 'number' && modificator === 'escape') {
    return String(value)
  }
  return value
}

function arrayIntersectionMany<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) {
    return []
  }

  if (arrays.length === 1) {
    return Array.from(new Set(arrays[0]))
  }

  arrays.sort((a, b) => a.length - b.length)
  const baseSet = new Set(arrays[0])
  const otherSets = arrays.slice(1).map(arr => new Set(arr))

  const result: T[] = []

  for (const item of baseSet) {
    let foundInAll = true
    for (const s of otherSets) {
      if (!s.has(item)) {
        foundInAll = false
        break
      }
    }
    if (foundInAll) {
      result.push(item)
    }
  }

  return result;
}
