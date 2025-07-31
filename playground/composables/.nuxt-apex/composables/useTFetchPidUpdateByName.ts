import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `put` request to `/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidUpdateByName = <T extends Omit<{updatedAt:string;innerId:string;isActive:boolean;itemId:string;viewId:string;createdAt:string;email:string;age:number;},'viewId'>&{'pid':string;'name':string;}&Partial<{nextId:string;}>, R extends {data:number[][];}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}`, { method: `put`, body:omit(data, 'pid','name'), ...opt })
/**
 * Generates a composable that sends a `put` request to `/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidUpdateByNameAsync = <T extends Omit<{updatedAt:string;innerId:string;isActive:boolean;itemId:string;viewId:string;createdAt:string;email:string;age:number;},'viewId'>&{'pid':string;'name':string;}&Partial<{nextId:string;}>, R extends {data:number[][];}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:number[][];}>(`/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}`, { method: `put`, body:omit(data, 'pid','name'), ...opt })


