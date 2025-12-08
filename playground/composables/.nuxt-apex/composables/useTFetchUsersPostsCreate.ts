import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `post` request to `/api/users/posts` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchUsersPostsCreate = <T extends Record<string, any>, R extends {data:boolean;categoryId:any;}>(data: T = {} as T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/users/posts`, { method: `post`, body:data, ...opt })
/**
 * Generates a composable that sends a `post` request to `/api/users/posts` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchUsersPostsCreateAsync = <T extends Record<string, any>, R extends {data:boolean;categoryId:any;}>(data: T = {} as T, opt: UseFetchOptions<R> = {}) => $fetch<{data:boolean;categoryId:any;}>(`/api/users/posts`, { method: `post`, body:data, ...opt })


