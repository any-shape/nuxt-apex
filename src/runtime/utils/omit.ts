export function apiGenOmit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const drop = new Set<K>(keys)
  const out = {} as Omit<T, K>

  for (const key of Object.keys(obj) as Array<keyof T>) {
    // @ts-ignore
    if (!drop.has(key)) {
      // @ts-ignore
      out[key] = obj[key]
    }
  }

  return out
}
