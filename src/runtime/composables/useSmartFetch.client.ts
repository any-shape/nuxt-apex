import { ref, type Ref } from 'vue'
import { $fetch } from 'ofetch'

// Extract the correct options type from ofetch
type OfetchOptions = Parameters<typeof $fetch>[1]

export interface SmartFetchReturnClient<T> {
  data:    Ref<T | null>
  error:   Ref<unknown>
  pending: Ref<boolean>
  refresh(): Promise<T | null>
  execute?(): Promise<T | null>
  abort():  void
}

export function useSmartFetch<T = any>(
  request: string | Request,
  opts?: {
    method?:  string
    query?:   Record<string, any>
    body?:    any
    headers?: Record<string,string>
    lazy?:    boolean
    watch?:   boolean  // no-op, for signature compatibility
  }
): SmartFetchReturnClient<T> {
  // force correct typing on refs
  const data    = ref(null) as Ref<T | null>
  const error   = ref(null) as Ref<unknown>
  const pending = ref(false)
  const controller = new AbortController()
  const url = typeof request === 'string' ? request : String(request)

  async function runFetch(): Promise<T | null> {
    pending.value = true
    error.value = null
    try {
      // @ts-ignore: ignore responseType mismatch
      const response = await $fetch<T>(url, {
        signal: controller.signal,
        ...(opts?.method  ? { method:  opts.method  } : {}),
        ...(opts?.query   ? { query:   opts.query   } : {}),
        ...(opts?.body    ? { body:    opts.body    } : {}),
        ...(opts?.headers ? { headers: opts.headers } : {}),
      } as OfetchOptions)
      data.value = response
    } catch (e) {
      error.value = e
    } finally {
      pending.value = false
    }
    return data.value
  }

  // Immediately execute unless lazy
  if (!opts?.lazy) {
    void runFetch()
  }

  return {
    data,
    error,
    pending,
    refresh: runFetch,
    execute: opts?.lazy ? runFetch : undefined,
    abort:   () => controller.abort(),
  }
}
