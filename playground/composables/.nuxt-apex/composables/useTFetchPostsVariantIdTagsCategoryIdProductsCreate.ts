import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `post` request to `/api/posts/${encodeURIComponent(data.variant-id)}/tags/${encodeURIComponent(data.category-id)}/products` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPostsVariantIdTagsCategoryIdProductsCreate = <T extends {updatedAt:string;createdAt:string;'variantId':string;'categoryId':string;}, R extends {data:{data:{data:(number|{data:number;result1:{data:number;}[];}[]|(string|{data:number[];}[]|{data:{data:{data:string;};result1:{data:string;};};result1:boolean[][];items2:boolean;})[])[];};};result1:{data:{data:{data:(boolean|{data:{data:number;};})[];};result1:{data:{data:number;};};items2:boolean;};result1:{data:boolean;};items2:{data:{data:{data:{data:(boolean|{data:boolean;}|{data:number;})[];};};};};};}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/posts/${encodeURIComponent(data.variant-id)}/tags/${encodeURIComponent(data.category-id)}/products`, { method: `post`, body:omit(data, 'variant-id','category-id'), ...opt })
/**
 * Generates a composable that sends a `post` request to `/api/posts/${encodeURIComponent(data.variant-id)}/tags/${encodeURIComponent(data.category-id)}/products` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPostsVariantIdTagsCategoryIdProductsCreateAsync = <T extends {updatedAt:string;createdAt:string;'variantId':string;'categoryId':string;}, R extends {data:{data:{data:(number|{data:number;result1:{data:number;}[];}[]|(string|{data:number[];}[]|{data:{data:{data:string;};result1:{data:string;};};result1:boolean[][];items2:boolean;})[])[];};};result1:{data:{data:{data:(boolean|{data:{data:number;};})[];};result1:{data:{data:number;};};items2:boolean;};result1:{data:boolean;};items2:{data:{data:{data:{data:(boolean|{data:boolean;}|{data:number;})[];};};};};};}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:{data:{data:(number|{data:number;result1:{data:number;}[];}[]|(string|{data:number[];}[]|{data:{data:{data:string;};result1:{data:string;};};result1:boolean[][];items2:boolean;})[])[];};};result1:{data:{data:{data:(boolean|{data:{data:number;};})[];};result1:{data:{data:number;};};items2:boolean;};result1:{data:boolean;};items2:{data:{data:{data:{data:(boolean|{data:boolean;}|{data:number;})[];};};};};};}>(`/api/posts/${encodeURIComponent(data.variant-id)}/tags/${encodeURIComponent(data.category-id)}/products`, { method: `post`, body:omit(data, 'variant-id','category-id'), ...opt })


