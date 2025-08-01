import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `post` request to `/api/tags/products/${encodeURIComponent(data.id)}/${encodeURIComponent(data.uid)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchTagsProductsIdCreateByUid = <T extends {isActive:boolean;email:string;'id':string;'uid':string;}, R extends {data:string[];result1:{data:number;result1:string;};type:any;pid:any;slug:any;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/tags/products/${encodeURIComponent(data.id)}/${encodeURIComponent(data.uid)}`, { method: `post`, body:omit(data, 'id','uid'), ...opt })
/**
 * Generates a composable that sends a `post` request to `/api/tags/products/${encodeURIComponent(data.id)}/${encodeURIComponent(data.uid)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchTagsProductsIdCreateByUidAsync = <T extends {isActive:boolean;email:string;'id':string;'uid':string;}, R extends {data:string[];result1:{data:number;result1:string;};type:any;pid:any;slug:any;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:string[];result1:{data:number;result1:string;};type:any;pid:any;slug:any;}>(`/api/tags/products/${encodeURIComponent(data.id)}/${encodeURIComponent(data.uid)}`, { method: `post`, body:omit(data, 'id','uid'), ...opt })


