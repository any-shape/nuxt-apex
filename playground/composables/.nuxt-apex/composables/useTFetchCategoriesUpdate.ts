import {useFetch} from 'nuxt/app'
export const useTFetchCategoriesUpdate = <T extends Omit<{updatedAt:string;email:string;outerId:string;viewId:string;},'updatedAt'>&Partial<{prevId:string;}>>(data: T) => useFetch<unknown>(`/api/categories`, { method: 'put', body:data })
export const useTFetchCategoriesUpdateAsync = <T extends Omit<{updatedAt:string;email:string;outerId:string;viewId:string;},'updatedAt'>&Partial<{prevId:string;}>>(data: T) => $fetch<unknown>(`/api/categories`, { method: 'put', body:data })
