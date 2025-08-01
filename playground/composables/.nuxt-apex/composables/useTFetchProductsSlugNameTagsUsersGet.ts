import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `get` request to `/api/products/${encodeURIComponent(data.slug)}/${encodeURIComponent(data.name)}/tags/users` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchProductsSlugNameTagsUsersGet = <T extends {outerId:string;productId:string;'slug':string;'name':string;}, R extends {data:{data:boolean;result1:{data:{data:{data:string;result1:boolean;};result1:string;};result1:boolean[];items2:boolean;};}[];}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/products/${encodeURIComponent(data.slug)}/${encodeURIComponent(data.name)}/tags/users`, { method: `get`, query:omit(data, 'slug','name'), ...opt })
/**
 * Generates a composable that sends a `get` request to `/api/products/${encodeURIComponent(data.slug)}/${encodeURIComponent(data.name)}/tags/users` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchProductsSlugNameTagsUsersGetAsync = <T extends {outerId:string;productId:string;'slug':string;'name':string;}, R extends {data:{data:boolean;result1:{data:{data:{data:string;result1:boolean;};result1:string;};result1:boolean[];items2:boolean;};}[];}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:{data:boolean;result1:{data:{data:{data:string;result1:boolean;};result1:string;};result1:boolean[];items2:boolean;};}[];}>(`/api/products/${encodeURIComponent(data.slug)}/${encodeURIComponent(data.name)}/tags/users`, { method: `get`, query:omit(data, 'slug','name'), ...opt })


