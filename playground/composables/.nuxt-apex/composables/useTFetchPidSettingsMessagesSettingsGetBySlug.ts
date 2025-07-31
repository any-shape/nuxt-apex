import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `get` request to `/api/${encodeURIComponent(data.pid)}/settings/messages/settings/${encodeURIComponent(data.slug)}` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidSettingsMessagesSettingsGetBySlug = <T extends {'pid':string;'slug':string;}&{viewId:string;createdAt:string;email:string;}|{productId:string;nextId:string;age:number;}, R extends {data:number[];result1:boolean;items2:{data:boolean;};vid:any;}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/${encodeURIComponent(data.pid)}/settings/messages/settings/${encodeURIComponent(data.slug)}`, { method: `get`, query:omit(data, 'pid','slug'), ...opt })
/**
 * Generates a composable that sends a `get` request to `/api/${encodeURIComponent(data.pid)}/settings/messages/settings/${encodeURIComponent(data.slug)}` endpoint with the given data as `query`.
 * @param data - Data to send as query.
 * @param opt - Options to pass to the underlying `useFetch`.
 
 */
export const useTFetchPidSettingsMessagesSettingsGetBySlugAsync = <T extends {'pid':string;'slug':string;}&{viewId:string;createdAt:string;email:string;}|{productId:string;nextId:string;age:number;}, R extends {data:number[];result1:boolean;items2:{data:boolean;};vid:any;}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:number[];result1:boolean;items2:{data:boolean;};vid:any;}>(`/api/${encodeURIComponent(data.pid)}/settings/messages/settings/${encodeURIComponent(data.slug)}`, { method: `get`, query:omit(data, 'pid','slug'), ...opt })


