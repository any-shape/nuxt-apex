import { EventHandler, EventHandlerRequest, EventHandlerResponse, H3Event, isError } from 'h3'
import { z, ZodType, type SafeParseReturnType } from 'zod'

type ApexEventHandler<D> = (data: D, event: H3Event<EventHandlerRequest>) => EventHandlerResponse
type Validator<T> = { [K in keyof T]: ZodType }
type Source = Record<string, unknown>

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
    let parsed: SafeParseReturnType<Data, Data> | undefined

    try {
      const raw = await useData<Data>()

      if (validator) {
        shape = typeof validator === 'function' ? validator(z, raw) : validator
        const schema = shape ? z.object(validator as Record<string, ZodType>) : null

        const parsed = schema?.safeParse(raw)
        if (!parsed?.success) {
          throw createError({
            statusCode: 422,
            message: JSON.stringify(parsed?.error.flatten().fieldErrors),
          })
        }
      }

      return await handler((parsed?.data || raw) as Data, event)
    } catch (error: any) {
      console.error(error)
      if (isError(error)) throw error
      throw createError({ message: error.message, statusCode: error.statusCode || 500 })
    }
  })
}

export async function useData<Payload>() {
  const e = useEvent()
  const hasBody = ['POST','PUT','PATCH'].includes(e.method.toUpperCase())

  const bodyInfo =  hasBody ? (await readBody(e)) ?? {} : {}
  const paramsInfo = getRouterParams(e) ?? {}
  const queryInfo = getQuery(e) ?? {}

  return mergeSources(bodyInfo, paramsInfo, queryInfo) as Payload
}

function mergeSources<T extends Source[]>(...sources: T): T[number] {
  const result: Record<string, unknown> = {}
  for (const src of sources) {
    for (const key of Object.keys(src)) {
      if (key in result) {
        throw createError({ statusCode: 500, message: `Duplicate key "${key}"` })
      }
      result[key] = src[key]
    }
  }
  return result as any
}
