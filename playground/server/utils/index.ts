import { EventHandler, EventHandlerRequest, EventHandlerResponse, H3Event, isError } from 'h3'
import { z, ZodType } from 'zod'

type ApexEventHandler<D> = (data: D, event: H3Event<EventHandlerRequest>) => EventHandlerResponse
type Validator<T> = { [K in keyof T]: ZodType }

export function defineApexHandler<Data = unknown, Req extends EventHandlerRequest = EventHandlerRequest>(
  handler: ApexEventHandler<Data>,
  validator?: Validator<Data>
): EventHandler<Req>
export function defineApexHandler<Data = unknown, Req extends EventHandlerRequest = EventHandlerRequest>(
  handler: ApexEventHandler<Data>,
  validator?: (z: typeof import('zod').z, raw: Data) => Validator<Data>
): EventHandler<Req>
export function defineApexHandler<Data = unknown, Req extends EventHandlerRequest = EventHandlerRequest>(
  handler: ApexEventHandler<Data>,
  validator?: Validator<Data> | ((z: typeof import('zod').z, raw: Data) => Validator<Data>)
): EventHandler<Req> {
  return defineEventHandler<Req>(async (event) => {
    let shape: Validator<Data> | undefined
    try {
      const raw = await useData<Data>()

      if(validator){ shape = typeof validator === 'function' ? validator(z, raw) : validator }
      const schema = shape ? z.object(validator as Record<string, ZodType>) : null

      const parsed = schema?.safeParse(raw)
      if (!parsed?.success) {
        throw createError({
          statusCode: 422,
          message: JSON.stringify(parsed?.error.flatten().fieldErrors),
        })
      }

      return await handler((parsed?.data || raw) as Data, event)
    } catch (error: any) {
      if (isError(error)) throw error
      throw createError({ message: error.message, statusCode: error.statusCode || 500 })
    }
  })
}

export async function useData<Payload>() {
  const e = useEvent()
  const paramsInfo = getRouterParams(e)

  const hasBody = ['POST','PUT','PATCH','DELETE'].includes(e.method.toUpperCase())
  const bodyInfo =  hasBody ? await readBody<Record<string, unknown>>(e) : {}

  const queryInfo = getQuery(e)

  const intersected = arrayIntersectionMany(Object.keys(paramsInfo), Object.keys(bodyInfo), Object.keys(queryInfo))
  if(intersected.length > 0)
    throw createError({ message: `Duplicate keys ${intersected} in params/query/body object`, statusCode: 500 })

  return { ...paramsInfo, ...bodyInfo, ...queryInfo } as Payload
}

function arrayIntersectionMany<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return []
  if (arrays.length === 1) return Array.from(new Set(arrays[0]))

  arrays.sort((a, b) => a.length - b.length)
  const base = new Set(arrays[0])

  return Array.from(base).filter(item =>arrays.slice(1).every(arr => arr.includes(item)))
}
