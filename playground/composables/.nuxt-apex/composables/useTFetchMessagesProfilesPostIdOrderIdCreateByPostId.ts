import {useFetch,type UseFetchOptions} from 'nuxt/app'
/**
 * Generates a composable that sends a `post` request to `/api/messages/profiles/${encodeURIComponent(data.postId)}/${encodeURIComponent(data.orderId)}/${encodeURIComponent(data.postId)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 * @alias `getPosts`.
 */
export const useTFetchMessagesProfilesPostIdOrderIdCreateByPostId = <T extends {postId:string;orderId:string;}&{status:string;innerId:string;}&{prevId:string;}, R extends {data:{data:boolean;};}>(data: T, opt: UseFetchOptions<R> = {}) => useFetch<R>(`/api/messages/profiles/${encodeURIComponent(data.postId)}/${encodeURIComponent(data.orderId)}/${encodeURIComponent(data.postId)}`, { method: `post`, body:omit(data, 'postId','orderId','postId'), ...opt })
/**
 * Generates a composable that sends a `post` request to `/api/messages/profiles/${encodeURIComponent(data.postId)}/${encodeURIComponent(data.orderId)}/${encodeURIComponent(data.postId)}` endpoint with the given data as `body`.
 * @param data - Data to send as body.
 * @param opt - Options to pass to the underlying `useFetch`.
 * @alias `getPosts`.
 */
export const useTFetchMessagesProfilesPostIdOrderIdCreateByPostIdAsync = <T extends {postId:string;orderId:string;}&{status:string;innerId:string;}&{prevId:string;}, R extends {data:{data:boolean;};}>(data: T, opt: UseFetchOptions<R> = {}) => $fetch<{data:{data:boolean;};}>(`/api/messages/profiles/${encodeURIComponent(data.postId)}/${encodeURIComponent(data.orderId)}/${encodeURIComponent(data.postId)}`, { method: `post`, body:omit(data, 'postId','orderId','postId'), ...opt })

export const getPosts = useTFetchMessagesProfilesPostIdOrderIdCreateByPostId
export const getPostsAsync = useTFetchMessagesProfilesPostIdOrderIdCreateByPostIdAsync
