import {useFetch,type UseFetchOptions} from 'nuxt/app'
export const useTFetchUsersPostsCreate = <T extends unknown, R extends {data:boolean;categoryId:any;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/users/posts`, { method: 'post', body:data, ...opt })
export const useTFetchUsersPostsCreateAsync = <T extends unknown, R extends {data:boolean;categoryId:any;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:boolean;categoryId:any;}>(`/api/users/posts`, { method: 'post', body:data, ...opt })
