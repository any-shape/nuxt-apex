import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `post` request to `/api/tags/${encodeURIComponent(data.uid)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchTagsCreateByUid = <T extends Omit<{price:number;innerId:string;email:string;status:string;count:number;outerId:string;title:string;},'count'>&{'uid':string;}&Partial<{prevId:string;itemId:string;}>, R extends {data:number;result1:{data:{data:(string|{data:(number|(string|(string|number|boolean)[])[])[];result1?:undefined;items2?:undefined;}|{data:({data:(string|boolean)[];}|(boolean|(string|number|boolean)[])[])[];result1:string;items2:number;})[];};result1:{data:boolean;result1:number;};items2:({data:{data:number;result1:{data:number;};};}|(number|(string|{data:boolean;result1:(number|boolean[])[];items2:{data:number;};})[])[])[];};items2:number;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/tags/${encodeURIComponent(data.uid)}`, { method: `post`, body:omit(data, 'uid'), ...opt })
/**
 * Generates a composable that sends a `post` request to `/api/tags/${encodeURIComponent(data.uid)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchTagsCreateByUidAsync = <T extends Omit<{price:number;innerId:string;email:string;status:string;count:number;outerId:string;title:string;},'count'>&{'uid':string;}&Partial<{prevId:string;itemId:string;}>, R extends {data:number;result1:{data:{data:(string|{data:(number|(string|(string|number|boolean)[])[])[];result1?:undefined;items2?:undefined;}|{data:({data:(string|boolean)[];}|(boolean|(string|number|boolean)[])[])[];result1:string;items2:number;})[];};result1:{data:boolean;result1:number;};items2:({data:{data:number;result1:{data:number;};};}|(number|(string|{data:boolean;result1:(number|boolean[])[];items2:{data:number;};})[])[])[];};items2:number;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:number;result1:{data:{data:(string|{data:(number|(string|(string|number|boolean)[])[])[];result1?:undefined;items2?:undefined;}|{data:({data:(string|boolean)[];}|(boolean|(string|number|boolean)[])[])[];result1:string;items2:number;})[];};result1:{data:boolean;result1:number;};items2:({data:{data:number;result1:{data:number;};};}|(number|(string|{data:boolean;result1:(number|boolean[])[];items2:{data:number;};})[])[])[];};items2:number;}>(`/api/tags/${encodeURIComponent(data.uid)}`, { method: `post`, body:omit(data, 'uid'), ...opt })


