import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `put` request to `/api/categories` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchCategoriesUpdate = <T extends Omit<{updatedAt:string;email:string;outerId:string;viewId:string;},'updatedAt'>&Partial<{prevId:string;}>, R extends {data:{data:number;result1:({data:number;result1:boolean;items2:number;}[][][]|{data:boolean;result1:(boolean[]|{data:number;result1:number;})[][];items2:{data:number;result1:boolean;}[];})[][];items2:string;};}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/categories`, { method: `put`, body:data, ...opt })
/**
 * Generates a composable that sends a `put` request to `/api/categories` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchCategoriesUpdateAsync = <T extends Omit<{updatedAt:string;email:string;outerId:string;viewId:string;},'updatedAt'>&Partial<{prevId:string;}>, R extends {data:{data:number;result1:({data:number;result1:boolean;items2:number;}[][][]|{data:boolean;result1:(boolean[]|{data:number;result1:number;})[][];items2:{data:number;result1:boolean;}[];})[][];items2:string;};}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:{data:number;result1:({data:number;result1:boolean;items2:number;}[][][]|{data:boolean;result1:(boolean[]|{data:number;result1:number;})[][];items2:{data:number;result1:boolean;}[];})[][];items2:string;};}>(`/api/categories`, { method: `put`, body:data, ...opt })


