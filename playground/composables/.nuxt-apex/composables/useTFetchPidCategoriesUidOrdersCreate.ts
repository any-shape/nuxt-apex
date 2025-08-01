import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `post` request to `/api/${encodeURIComponent(data.pid)}/categories/${encodeURIComponent(data.uid)}/orders` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidCategoriesUidOrdersCreate = <T extends {age:number;createdAt:string;innerId:string;'pid':string;'uid':string;}, R extends {data:{data:{data:{data:number[];};}[];result1:{data:{data:{data:{}[];};result1:{data:boolean;}[];items2:string;};result1:{data:number;result1:({data:{};}|(boolean|{data:string;})[])[];items2:number;};items2:{data:string;};};items2:boolean;}[];}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/${encodeURIComponent(data.pid)}/categories/${encodeURIComponent(data.uid)}/orders`, { method: `post`, body:omit(data, 'pid','uid'), ...opt })
/**
 * Generates a composable that sends a `post` request to `/api/${encodeURIComponent(data.pid)}/categories/${encodeURIComponent(data.uid)}/orders` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidCategoriesUidOrdersCreateAsync = <T extends {age:number;createdAt:string;innerId:string;'pid':string;'uid':string;}, R extends {data:{data:{data:{data:number[];};}[];result1:{data:{data:{data:{}[];};result1:{data:boolean;}[];items2:string;};result1:{data:number;result1:({data:{};}|(boolean|{data:string;})[])[];items2:number;};items2:{data:string;};};items2:boolean;}[];}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:{data:{data:{data:number[];};}[];result1:{data:{data:{data:{}[];};result1:{data:boolean;}[];items2:string;};result1:{data:number;result1:({data:{};}|(boolean|{data:string;})[])[];items2:number;};items2:{data:string;};};items2:boolean;}[];}>(`/api/${encodeURIComponent(data.pid)}/categories/${encodeURIComponent(data.uid)}/orders`, { method: `post`, body:omit(data, 'pid','uid'), ...opt })


