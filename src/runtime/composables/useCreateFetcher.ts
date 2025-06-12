import { ref, type Ref } from 'vue'
import { useFetch } from '#app'

type FetchReturn<T> = {
  data:   Ref<T | undefined>
  pending: Ref<boolean>
  error:  Ref<unknown>
  refresh: () => Promise<void>
}

export function useCreateFetcher<T>(
  url: string,
  opts: Parameters<typeof useFetch>[1] = {}
): FetchReturn<T> {
  const data = ref<T>()
  const pending = ref(true)
  const error = ref<unknown>(null)

  const doFetch = async () => {
    pending.value = true
    try {
      // @ts-ignore
      data.value = await $fetch<T>(url, opts)
    } catch (err) {
      error.value = err
    } finally {
      pending.value = false
    }
  }

  void doFetch()

  return { data, pending, error, refresh: doFetch }
}

