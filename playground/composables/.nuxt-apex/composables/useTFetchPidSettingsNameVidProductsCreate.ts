import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `post` request to `/api/${encodeURIComponent(data.pid)}/settings/${encodeURIComponent(data.name)}/${encodeURIComponent(data.vid)}/products` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidSettingsNameVidProductsCreate = <T extends {'pid':string;'name':string;'vid':string;}&{updatedAt:string;outerId:string;}|{age:number;}, R extends {data:number;result1:boolean;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/${encodeURIComponent(data.pid)}/settings/${encodeURIComponent(data.name)}/${encodeURIComponent(data.vid)}/products`, { method: `post`, body:omit(data, 'pid','name','vid'), ...opt })
/**
 * Generates a composable that sends a `post` request to `/api/${encodeURIComponent(data.pid)}/settings/${encodeURIComponent(data.name)}/${encodeURIComponent(data.vid)}/products` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidSettingsNameVidProductsCreateAsync = <T extends {'pid':string;'name':string;'vid':string;}&{updatedAt:string;outerId:string;}|{age:number;}, R extends {data:number;result1:boolean;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:number;result1:boolean;}>(`/api/${encodeURIComponent(data.pid)}/settings/${encodeURIComponent(data.name)}/${encodeURIComponent(data.vid)}/products`, { method: `post`, body:omit(data, 'pid','name','vid'), ...opt })


