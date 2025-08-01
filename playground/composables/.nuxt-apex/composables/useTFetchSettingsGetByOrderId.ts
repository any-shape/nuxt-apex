import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `get` request to `/api/settings/${encodeURIComponent(data.orderId)}` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchSettingsGetByOrderId = <T extends {status:string;nextId:string;'orderId':string;}, R extends {data:number;result1:{data:string;result1:boolean;items2:{data:{data:boolean;};result1:boolean[];};};items2:{data:{data:{data:{data:(string|number[]|{data:number;})[][];};result1:{data:{data:{}[];};};};result1:number;items2:{data:((string|{data:number;})[][]|{data:string;})[];};};};}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/settings/${encodeURIComponent(data.orderId)}`, { method: `get`, query:omit(data, 'orderId'), ...opt })
/**
 * Generates a composable that sends a `get` request to `/api/settings/${encodeURIComponent(data.orderId)}` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchSettingsGetByOrderIdAsync = <T extends {status:string;nextId:string;'orderId':string;}, R extends {data:number;result1:{data:string;result1:boolean;items2:{data:{data:boolean;};result1:boolean[];};};items2:{data:{data:{data:{data:(string|number[]|{data:number;})[][];};result1:{data:{data:{}[];};};};result1:number;items2:{data:((string|{data:number;})[][]|{data:string;})[];};};};}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:number;result1:{data:string;result1:boolean;items2:{data:{data:boolean;};result1:boolean[];};};items2:{data:{data:{data:{data:(string|number[]|{data:number;})[][];};result1:{data:{data:{}[];};};};result1:number;items2:{data:((string|{data:number;})[][]|{data:string;})[];};};};}>(`/api/settings/${encodeURIComponent(data.orderId)}`, { method: `get`, query:omit(data, 'orderId'), ...opt })


