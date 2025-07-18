import {useFetch} from 'nuxt/app'
export const useTFetchPidNameMessagesGet = <T extends {count:number;itemId:string;'pid':string;'name':string;}>(data: T) => useFetch<unknown>(`/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}/messages`, { method: 'get', query:omit(data, 'pid','name') })
export const useTFetchPidNameMessagesGetAsync = <T extends {count:number;itemId:string;'pid':string;'name':string;}>(data: T) => $fetch<unknown>(`/api/${encodeURIComponent(data.pid)}/${encodeURIComponent(data.name)}/messages`, { method: 'get', query:omit(data, 'pid','name') })
