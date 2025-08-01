import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `post` request to `/api/users/posts` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchUsersPostsCreate = <T extends Omit<{status:string;createdAt:string;email:string;age:number;nextId:string;isActive:boolean;},'nextId'>&Partial<{createdAt:string;count:number;outerId:string;}>, R extends {data:boolean;categoryId:any;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/users/posts`, { method: `post`, body:data, ...opt })
/**
 * Generates a composable that sends a `post` request to `/api/users/posts` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchUsersPostsCreateAsync = <T extends Omit<{status:string;createdAt:string;email:string;age:number;nextId:string;isActive:boolean;},'nextId'>&Partial<{createdAt:string;count:number;outerId:string;}>, R extends {data:boolean;categoryId:any;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:boolean;categoryId:any;}>(`/api/users/posts`, { method: `post`, body:data, ...opt })


