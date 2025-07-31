import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `delete` request to `/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}/tags` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidNameTagsRemove = <T extends {productId:string;age:number;isActive:boolean;'pid':string;'name':string;}, R extends {data:{data:{data:boolean;result1:number;items2:boolean;};result1:number;items2:{data:{data:{data:string;}[];result1:string;};result1:boolean;items2:{data:{data:{data:{};};};};};};result1:{data:number;result1:number;};}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}/tags`, { method: `delete`, query:omit(data, 'pid','name'), ...opt })
/**
 * Generates a composable that sends a `delete` request to `/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}/tags` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidNameTagsRemoveAsync = <T extends {productId:string;age:number;isActive:boolean;'pid':string;'name':string;}, R extends {data:{data:{data:boolean;result1:number;items2:boolean;};result1:number;items2:{data:{data:{data:string;}[];result1:string;};result1:boolean;items2:{data:{data:{data:{};};};};};};result1:{data:number;result1:number;};}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:{data:{data:boolean;result1:number;items2:boolean;};result1:number;items2:{data:{data:{data:string;}[];result1:string;};result1:boolean;items2:{data:{data:{data:{};};};};};};result1:{data:number;result1:number;};}>(`/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}/tags`, { method: `delete`, query:omit(data, 'pid','name'), ...opt })


