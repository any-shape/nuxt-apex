import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `get` request to `/api/${encodeURIComponent(data.pid)}` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchGetByPid = <T extends Omit<{nextId:string;title:string;email:string;age:number;productId:string;viewId:string;price:number;},'nextId'>&{'pid':string;}&Partial<{createdAt:string;isActive:boolean;}>, R extends {data:string;result1:boolean;items2:boolean;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/${encodeURIComponent(data.pid)}`, { method: `get`, query:omit(data, 'pid'), ...opt })
/**
 * Generates a composable that sends a `get` request to `/api/${encodeURIComponent(data.pid)}` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchGetByPidAsync = <T extends Omit<{nextId:string;title:string;email:string;age:number;productId:string;viewId:string;price:number;},'nextId'>&{'pid':string;}&Partial<{createdAt:string;isActive:boolean;}>, R extends {data:string;result1:boolean;items2:boolean;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:string;result1:boolean;items2:boolean;}>(`/api/${encodeURIComponent(data.pid)}`, { method: `get`, query:omit(data, 'pid'), ...opt })


