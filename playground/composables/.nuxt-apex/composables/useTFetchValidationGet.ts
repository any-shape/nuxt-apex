import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `get` request to `/api/validation` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 * @alias `getValidationEndpoint`.
 */
export const useTFetchValidationGet = <T extends {a:string,b:number,d:string,t:boolean}, R extends {data:string;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/validation`, { method: `get`, query:data, ...opt })
/**
 * Generates a composable that sends a `get` request to `/api/validation` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 * @alias `getValidationEndpoint`.
 */
export const useTFetchValidationGetAsync = <T extends {a:string,b:number,d:string,t:boolean}, R extends {data:string;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:string;}>(`/api/validation`, { method: `get`, query:data, ...opt })

export const getValidationEndpoint = useTFetchValidationGet
export const getValidationEndpointAsync = useTFetchValidationGetAsync
