import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `get` request to `/api/posts/${encodeURIComponent(data.variant-id)}/profiles` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPostsVariantIdProfilesGet = <T extends {'variantId':string;}&{price:number;createdAt:string;}|{count:number;status:string;}, R extends {data:string;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/posts/${encodeURIComponent(data.variant-id)}/profiles`, { method: `get`, query:omit(data, 'variant-id'), ...opt })
/**
 * Generates a composable that sends a `get` request to `/api/posts/${encodeURIComponent(data.variant-id)}/profiles` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPostsVariantIdProfilesGetAsync = <T extends {'variantId':string;}&{price:number;createdAt:string;}|{count:number;status:string;}, R extends {data:string;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:string;}>(`/api/posts/${encodeURIComponent(data.variant-id)}/profiles`, { method: `get`, query:omit(data, 'variant-id'), ...opt })


