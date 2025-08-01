import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `put` request to `/api/products/posts/${encodeURIComponent(data.user-id)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchProductsPostsUpdateByUserId = <T extends {prevId:string;age:number;price:number;'userId':string;}, R extends {data:{data:number;result1:boolean;items2:{data:(number|string[])[][];result1:(boolean|{data:(string|boolean|(string|(string|number|boolean)[])[])[];})[];items2:{data:{data:{};};result1:{data:number;};};};};result1:{data:{data:{data:((number|{data:(string|boolean)[];}|(boolean|boolean[]|string[])[])[]|{data:(number[]|{data:number;})[];})[];result1:{data:number;};};result1:(string[]|(boolean|{data:(boolean|{data:boolean;})[];result1:number;items2?:undefined;}|{data:{data:{};};result1:{data:string[];};items2:(boolean|(number|boolean)[]|{data:boolean;})[];})[]|{data:{data:boolean;};})[];items2:{data:boolean;};};result1:boolean;};}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/products/posts/${encodeURIComponent(data.user-id)}`, { method: `put`, body:omit(data, 'user-id'), ...opt })
/**
 * Generates a composable that sends a `put` request to `/api/products/posts/${encodeURIComponent(data.user-id)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchProductsPostsUpdateByUserIdAsync = <T extends {prevId:string;age:number;price:number;'userId':string;}, R extends {data:{data:number;result1:boolean;items2:{data:(number|string[])[][];result1:(boolean|{data:(string|boolean|(string|(string|number|boolean)[])[])[];})[];items2:{data:{data:{};};result1:{data:number;};};};};result1:{data:{data:{data:((number|{data:(string|boolean)[];}|(boolean|boolean[]|string[])[])[]|{data:(number[]|{data:number;})[];})[];result1:{data:number;};};result1:(string[]|(boolean|{data:(boolean|{data:boolean;})[];result1:number;items2?:undefined;}|{data:{data:{};};result1:{data:string[];};items2:(boolean|(number|boolean)[]|{data:boolean;})[];})[]|{data:{data:boolean;};})[];items2:{data:boolean;};};result1:boolean;};}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:{data:number;result1:boolean;items2:{data:(number|string[])[][];result1:(boolean|{data:(string|boolean|(string|(string|number|boolean)[])[])[];})[];items2:{data:{data:{};};result1:{data:number;};};};};result1:{data:{data:{data:((number|{data:(string|boolean)[];}|(boolean|boolean[]|string[])[])[]|{data:(number[]|{data:number;})[];})[];result1:{data:number;};};result1:(string[]|(boolean|{data:(boolean|{data:boolean;})[];result1:number;items2?:undefined;}|{data:{data:{};};result1:{data:string[];};items2:(boolean|(number|boolean)[]|{data:boolean;})[];})[]|{data:{data:boolean;};})[];items2:{data:boolean;};};result1:boolean;};}>(`/api/products/posts/${encodeURIComponent(data.user-id)}`, { method: `put`, body:omit(data, 'user-id'), ...opt })


