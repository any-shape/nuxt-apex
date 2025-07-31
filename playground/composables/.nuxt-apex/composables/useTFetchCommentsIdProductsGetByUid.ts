import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `get` request to `/api/comments/${encodeURIComponent(data.id)}/products/${encodeURIComponent(data.uid)}` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 * @alias `getComments`.
 */
export const useTFetchCommentsIdProductsGetByUid = <T extends {email:string;updatedAt:string;'id':string;'uid':string;}, R extends {data:(string|number|(number|boolean[]|{data:{data:{data:boolean;result1:number;};result1:{data:string;};items2:{data:{data:boolean;};result1:(number|boolean)[];};};result1:string;items2:(string|{data:string;result1:(string|number|boolean)[];})[];}[])[])[];result1:number;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/comments/${encodeURIComponent(data.id)}/products/${encodeURIComponent(data.uid)}`, { method: `get`, query:omit(data, 'id','uid'), ...opt })
/**
 * Generates a composable that sends a `get` request to `/api/comments/${encodeURIComponent(data.id)}/products/${encodeURIComponent(data.uid)}` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 * @alias `getComments`.
 */
export const useTFetchCommentsIdProductsGetByUidAsync = <T extends {email:string;updatedAt:string;'id':string;'uid':string;}, R extends {data:(string|number|(number|boolean[]|{data:{data:{data:boolean;result1:number;};result1:{data:string;};items2:{data:{data:boolean;};result1:(number|boolean)[];};};result1:string;items2:(string|{data:string;result1:(string|number|boolean)[];})[];}[])[])[];result1:number;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:(string|number|(number|boolean[]|{data:{data:{data:boolean;result1:number;};result1:{data:string;};items2:{data:{data:boolean;};result1:(number|boolean)[];};};result1:string;items2:(string|{data:string;result1:(string|number|boolean)[];})[];}[])[])[];result1:number;}>(`/api/comments/${encodeURIComponent(data.id)}/products/${encodeURIComponent(data.uid)}`, { method: `get`, query:omit(data, 'id','uid'), ...opt })

export const getComments = useTFetchCommentsIdProductsGetByUid
export const getCommentsAsync = useTFetchCommentsIdProductsGetByUidAsync
