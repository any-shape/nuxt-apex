import {useFetch,type UseFetchOptions} from 'nuxt/app'
export const useTFetchValidationGet = <T extends unknown, R extends {data:string;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/validation`, { method: 'get', query:data, ...opt })
export const useTFetchValidationGetAsync = <T extends unknown, R extends {data:string;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:string;}>(`/api/validation`, { method: 'get', query:data, ...opt })
