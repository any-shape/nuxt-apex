import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `put` request to `/api/settings/orders/${encodeURIComponent(data.slug)}/${encodeURIComponent(data.orderId)}/tags` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchSettingsOrdersSlugOrderIdTagsUpdate = <T extends {createdAt:string;prevId:string;slug:string;orderId:string;}, R extends {data:{data:{data:boolean;result1:boolean;};result1:(string|{data:({data:(string|boolean)[][];result1:boolean;}|{data:(boolean|string[])[];result1?:undefined;})[];}|{data:string;}[])[];};result1:{data:{data:{data:{data:boolean;result1:number;items2:boolean[];};result1:{data:boolean;};};}[];};items2:string;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/settings/orders/${encodeURIComponent(data.slug)}/${encodeURIComponent(data.orderId)}/tags`, { method: `put`, body:omit(data, 'slug','orderId'), ...opt })
/**
 * Generates a composable that sends a `put` request to `/api/settings/orders/${encodeURIComponent(data.slug)}/${encodeURIComponent(data.orderId)}/tags` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchSettingsOrdersSlugOrderIdTagsUpdateAsync = <T extends {createdAt:string;prevId:string;slug:string;orderId:string;}, R extends {data:{data:{data:boolean;result1:boolean;};result1:(string|{data:({data:(string|boolean)[][];result1:boolean;}|{data:(boolean|string[])[];result1?:undefined;})[];}|{data:string;}[])[];};result1:{data:{data:{data:{data:boolean;result1:number;items2:boolean[];};result1:{data:boolean;};};}[];};items2:string;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:{data:{data:boolean;result1:boolean;};result1:(string|{data:({data:(string|boolean)[][];result1:boolean;}|{data:(boolean|string[])[];result1?:undefined;})[];}|{data:string;}[])[];};result1:{data:{data:{data:{data:boolean;result1:number;items2:boolean[];};result1:{data:boolean;};};}[];};items2:string;}>(`/api/settings/orders/${encodeURIComponent(data.slug)}/${encodeURIComponent(data.orderId)}/tags`, { method: `put`, body:omit(data, 'slug','orderId'), ...opt })


