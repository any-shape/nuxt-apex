import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `delete` request to `/api/comments/tags/posts` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchCommentsTagsPostsRemove = <T extends {outerId:string;viewId:string;title:string;}, R extends {data:(number|{data:number;result1:(boolean|boolean[]|{data:boolean;result1:{data:{data:boolean;};result1:number;};}[])[];items2:{data:string;result1:boolean[];items2:{data:{data:number[];result1:{data:{};};};};};})[];}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/comments/tags/posts`, { method: `delete`, query:data, ...opt })
/**
 * Generates a composable that sends a `delete` request to `/api/comments/tags/posts` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchCommentsTagsPostsRemoveAsync = <T extends {outerId:string;viewId:string;title:string;}, R extends {data:(number|{data:number;result1:(boolean|boolean[]|{data:boolean;result1:{data:{data:boolean;};result1:number;};}[])[];items2:{data:string;result1:boolean[];items2:{data:{data:number[];result1:{data:{};};};};};})[];}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:(number|{data:number;result1:(boolean|boolean[]|{data:boolean;result1:{data:{data:boolean;};result1:number;};}[])[];items2:{data:string;result1:boolean[];items2:{data:{data:number[];result1:{data:{};};};};};})[];}>(`/api/comments/tags/posts`, { method: `delete`, query:data, ...opt })


