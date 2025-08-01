import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `delete` request to `/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}/posts/${encodeURIComponent(data.variantId)}` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidNamePostsRemoveByVariantId = <T extends {'pid':string;'name':string;'variantId':string;}&{viewId:string;isActive:boolean;age:number;}|{nextId:string;outerId:string;}, R extends {data:{data:{data:boolean;};result1:(boolean|(number|{data:number;result1:boolean;items2:boolean;})[][])[];};}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}/posts/${encodeURIComponent(data.variantId)}`, { method: `delete`, query:omit(data, 'pid','name','variantId'), ...opt })
/**
 * Generates a composable that sends a `delete` request to `/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}/posts/${encodeURIComponent(data.variantId)}` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidNamePostsRemoveByVariantIdAsync = <T extends {'pid':string;'name':string;'variantId':string;}&{viewId:string;isActive:boolean;age:number;}|{nextId:string;outerId:string;}, R extends {data:{data:{data:boolean;};result1:(boolean|(number|{data:number;result1:boolean;items2:boolean;})[][])[];};}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:{data:{data:boolean;};result1:(boolean|(number|{data:number;result1:boolean;items2:boolean;})[][])[];};}>(`/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}/posts/${encodeURIComponent(data.variantId)}`, { method: `delete`, query:omit(data, 'pid','name','variantId'), ...opt })


