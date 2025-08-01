import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `post` request to `/api/${encodeURIComponent(data.pid)}/tags/${encodeURIComponent(data.categoryId)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidTagsCreateByCategoryId = <T extends {'pid':string;'categoryId':string;}&{outerId:string;status:string;email:string;}|{createdAt:string;age:number;}, R extends {data:{data:(string|boolean|{data:{data:{data:string;result1:{data:boolean;};};result1:{data:{data:boolean;result1:string;};};items2:((number|boolean)[]|{data:number;result1:number;items2:string;}|{data:string;result1:number;items2:string;})[];}[];result1:{data:boolean;result1:({data:boolean[];result1:string;items2?:undefined;}|{data:boolean;result1:string[];items2:(number|boolean)[];})[];};})[];};}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/${encodeURIComponent(data.pid)}/tags/${encodeURIComponent(data.categoryId)}`, { method: `post`, body:omit(data, 'pid','categoryId'), ...opt })
/**
 * Generates a composable that sends a `post` request to `/api/${encodeURIComponent(data.pid)}/tags/${encodeURIComponent(data.categoryId)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidTagsCreateByCategoryIdAsync = <T extends {'pid':string;'categoryId':string;}&{outerId:string;status:string;email:string;}|{createdAt:string;age:number;}, R extends {data:{data:(string|boolean|{data:{data:{data:string;result1:{data:boolean;};};result1:{data:{data:boolean;result1:string;};};items2:((number|boolean)[]|{data:number;result1:number;items2:string;}|{data:string;result1:number;items2:string;})[];}[];result1:{data:boolean;result1:({data:boolean[];result1:string;items2?:undefined;}|{data:boolean;result1:string[];items2:(number|boolean)[];})[];};})[];};}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:{data:(string|boolean|{data:{data:{data:string;result1:{data:boolean;};};result1:{data:{data:boolean;result1:string;};};items2:((number|boolean)[]|{data:number;result1:number;items2:string;}|{data:string;result1:number;items2:string;})[];}[];result1:{data:boolean;result1:({data:boolean[];result1:string;items2?:undefined;}|{data:boolean;result1:string[];items2:(number|boolean)[];})[];};})[];};}>(`/api/${encodeURIComponent(data.pid)}/tags/${encodeURIComponent(data.categoryId)}`, { method: `post`, body:omit(data, 'pid','categoryId'), ...opt })


