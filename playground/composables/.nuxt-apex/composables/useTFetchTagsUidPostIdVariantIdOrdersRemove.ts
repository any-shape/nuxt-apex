import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `delete` request to `/api/tags/${encodeURIComponent(data.uid)}/${encodeURIComponent(data.postId)}/${encodeURIComponent(data.variantId)}/orders` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchTagsUidPostIdVariantIdOrdersRemove = <T extends {'uid':string;'postId':string;'variantId':string;}&{isActive:boolean;nextId:string;}&{age:number;itemId:string;}, R extends {data:(string|{data:{data:{data:boolean;result1:{data:{data:(string|number)[];};result1:{data:(string|boolean)[];};items2:boolean[];};};};result1:number;})[];}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/tags/${encodeURIComponent(data.uid)}/${encodeURIComponent(data.postId)}/${encodeURIComponent(data.variantId)}/orders`, { method: `delete`, query:omit(data, 'uid','postId','variantId'), ...opt })
/**
 * Generates a composable that sends a `delete` request to `/api/tags/${encodeURIComponent(data.uid)}/${encodeURIComponent(data.postId)}/${encodeURIComponent(data.variantId)}/orders` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchTagsUidPostIdVariantIdOrdersRemoveAsync = <T extends {'uid':string;'postId':string;'variantId':string;}&{isActive:boolean;nextId:string;}&{age:number;itemId:string;}, R extends {data:(string|{data:{data:{data:boolean;result1:{data:{data:(string|number)[];};result1:{data:(string|boolean)[];};items2:boolean[];};};};result1:number;})[];}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:(string|{data:{data:{data:boolean;result1:{data:{data:(string|number)[];};result1:{data:(string|boolean)[];};items2:boolean[];};};};result1:number;})[];}>(`/api/tags/${encodeURIComponent(data.uid)}/${encodeURIComponent(data.postId)}/${encodeURIComponent(data.variantId)}/orders`, { method: `delete`, query:omit(data, 'uid','postId','variantId'), ...opt })


