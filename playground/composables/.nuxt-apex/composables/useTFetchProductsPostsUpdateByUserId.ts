import {useFetch} from 'nuxt/app'
export const useTFetchProductsPostsUpdateByUserId = <T extends {prevId:string;age:number;price:number;'userId':string;}>(data: T) => useFetch<unknown>(`/api/products/posts/${encodeURIComponent(data.user-id)}`, { method: 'put', body:omit(data, 'user-id') })
export const useTFetchProductsPostsUpdateByUserIdAsync = <T extends {prevId:string;age:number;price:number;'userId':string;}>(data: T) => $fetch<unknown>(`/api/products/posts/${encodeURIComponent(data.user-id)}`, { method: 'put', body:omit(data, 'user-id') })
