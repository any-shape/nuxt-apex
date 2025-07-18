import {useFetch} from 'nuxt/app'
export const useTFetchValidationGet = <T extends unknown>(data: T) => useFetch<unknown>(`/api/validation`, { method: 'get', query:data })
export const useTFetchValidationGetAsync = <T extends unknown>(data: T) => $fetch<unknown>(`/api/validation`, { method: 'get', query:data })
