import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `get` request to `/api/${encodeURIComponent(data.pid)}/users/${encodeURIComponent(data.categoryId)}/tags/tags` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidUsersCategoryIdTagsTagsGet = <T extends {count:number;email:string;'pid':string;'categoryId':string;}, R extends {data:number;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/${encodeURIComponent(data.pid)}/users/${encodeURIComponent(data.categoryId)}/tags/tags`, { method: `get`, query:omit(data, 'pid','categoryId'), ...opt })
/**
 * Generates a composable that sends a `get` request to `/api/${encodeURIComponent(data.pid)}/users/${encodeURIComponent(data.categoryId)}/tags/tags` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidUsersCategoryIdTagsTagsGetAsync = <T extends {count:number;email:string;'pid':string;'categoryId':string;}, R extends {data:number;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:number;}>(`/api/${encodeURIComponent(data.pid)}/users/${encodeURIComponent(data.categoryId)}/tags/tags`, { method: `get`, query:omit(data, 'pid','categoryId'), ...opt })


