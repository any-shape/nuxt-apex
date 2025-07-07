import type { EventHandler, EventHandlerRequest, EventHandlerResponse, H3Event } from 'h3'
type AdwancedEventHandler<D> = (data: D, event: H3Event<EventHandlerRequest>) => EventHandlerResponse

export function defineApexHandler<D = unknown, T extends EventHandlerRequest = EventHandlerRequest>(handler: AdwancedEventHandler<D>): EventHandler<T> {
  return defineEventHandler<T>(async (event) => {
    try {
      return await handler([] as D, event)
    } catch (error: any) {
      return undefined
    }
  })
}


export function resp() {
  return getDynmicaData<{c: number, d: string, u: Array<number>}[]>()
}

function getDynmicaData<T>() {
  return [] as T
}
