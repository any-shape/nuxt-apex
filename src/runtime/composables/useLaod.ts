import { ref, shallowRef, type Ref, type ShallowRef } from 'vue'

/**
 * Status of the load operation, matching useFetch statuses.
 */
export type LoadStatus = 'idle' | 'pending' | 'success' | 'error'

/**
 * Options for useLoad when providing an async function.
 * @template A - tuple of arguments the async function accepts
 */
export interface UseLoadOptions<A extends any[]> {
  /** Auto‑invoke on setup */
  immediate?: boolean
  /** Initial args for immediate load */
  args?: A
}

/**
 * Return value from useLoad.
 * @template T - return type of the async operation
 * @template A - tuple of arguments for the load trigger
 */
export interface UseLoadReturn<T, A extends any[]> {
  status: Ref<LoadStatus>
  data: ShallowRef<T | null>
  error: ShallowRef<unknown>
  /** Trigger the async operation again */
  load: (...args: A) => Promise<void>
}

// Overload: accept a standalone Promise (one‑shot, immediate)
export function useLoad<T>(promise: Promise<T>): UseLoadReturn<T, []>
// Overload: accept an async function + options
export function useLoad<T, A extends any[]>(
  asyncFn: (...args: A) => Promise<T>,
  options?: UseLoadOptions<A>
): UseLoadReturn<T, A>

// Implementation
export function useLoad<T, A extends any[]>(
  runner: Promise<T> | ((...args: A) => Promise<T>),
  options: UseLoadOptions<A> = {} as UseLoadOptions<A>
): UseLoadReturn<T, A> {
  const status = ref<LoadStatus>('idle')
  const data = shallowRef<T | null>(null)
  const error = shallowRef<unknown>(null)

  let lastCallId = 0
  let isActive = true

  const cancel = () => {
    lastCallId++
    status.value = 'idle'
  }

  const load = async (...args: A) => {
    // Only valid when runner is a function
    if (typeof runner !== 'function') return
    const callId = ++lastCallId
    status.value = 'pending'
    error.value = null
    try {
      const result = await (runner as (...args: A) => Promise<T>)(...args)
      if (!isActive || callId !== lastCallId) return
      data.value = result
      status.value = 'success'
    } catch (err) {
      if (!isActive || callId !== lastCallId) return
      error.value = err
      status.value = 'error'
    }
  }

  const isPromise = runner !== null && typeof (runner as any)?.then === 'function'

  if (isPromise) {
    // One‑shot promise: execute immediately
    const promise = runner as Promise<T>
    const callId = ++lastCallId
    status.value = 'pending'
    promise.then((res) => {
      if (!isActive || callId !== lastCallId) return
      data.value = res
      status.value = 'success'
    }).catch((err) => {
      if (!isActive || callId !== lastCallId) return
      error.value = err
      status.value = 'error'
    })
  } else {
    // Function runner: handle immediate option
    const { immediate = false, args: initialArgs } = options
    if (immediate) {
      load(...(initialArgs ?? ([] as unknown as A)))
    }
  }

  return { status, data, error, load }
}
