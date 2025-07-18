import {useFetch} from 'nuxt/app'
export const useTFetchCommentsTagsPostsRemove = <T extends {outerId:string;viewId:string;title:string;}>(data: T) => useFetch<unknown>(`/api/comments/tags/posts`, { method: 'delete', query:data })
export const useTFetchCommentsTagsPostsRemoveAsync = <T extends {outerId:string;viewId:string;title:string;}>(data: T) => $fetch<unknown>(`/api/comments/tags/posts`, { method: 'delete', query:data })
