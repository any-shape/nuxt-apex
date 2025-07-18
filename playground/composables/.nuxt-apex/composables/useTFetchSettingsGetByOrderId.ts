import {useFetch} from 'nuxt/app'
export const useTFetchSettingsGetByOrderId = <T extends {status:string;nextId:string;'orderId':string;}>(data: T) => useFetch<unknown>(`/api/settings/${encodeURIComponent(data.orderId)}`, { method: 'get', query:omit(data, 'orderId') })
export const useTFetchSettingsGetByOrderIdAsync = <T extends {status:string;nextId:string;'orderId':string;}>(data: T) => $fetch<unknown>(`/api/settings/${encodeURIComponent(data.orderId)}`, { method: 'get', query:omit(data, 'orderId') })
