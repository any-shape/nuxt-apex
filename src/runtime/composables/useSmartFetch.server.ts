import { useFetch, type AsyncData, type UseFetchOptions } from '#app'

/**
 * Exactly mirror Nuxt’s AsyncData<T, Error>
 * plus a no-op abort so the interface always has an `abort()`
 */
export type SmartFetchReturnServer<T> = AsyncData<T, Error> & { abort(): void }

/** Only lazy & watch apply on the server side */
export function useSmartFetch<T = any>(
  request: string | Request,
  opts?: Pick<UseFetchOptions<T>, 'lazy' | 'watch'>
): SmartFetchReturnServer<T> {
  const { lazy, watch } = opts || {}
  const asyncData = useFetch<T>(request, { lazy, watch })

  // attach a stub so callers can always do `.abort()`
  ;(asyncData as any).abort = () => {}

  return asyncData as SmartFetchReturnServer<T>
}
