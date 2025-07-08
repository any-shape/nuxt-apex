const modules = import.meta.glob('../node_modules/', { eager: true })

type ModuleMap = {
  [P in keyof typeof modules as keyof typeof modules[P]]: (
    ...args: any[]
  ) => any
}

const registry = Object.entries(modules).reduce((acc, [path, mod]) => {
  // assume each file exports a single default-named composable
  // e.g. export function useMyComposable(...) { … }
  Object.assign(acc, mod as any)
  return acc
}, {} as ModuleMap)

export function invokeComposable<K extends keyof ModuleMap>(
  name: K,
  params: Parameters<ModuleMap[K]>
): ReturnType<ModuleMap[K]> {
  const fn = registry[name]
  if (!fn) throw new Error(`Composable "${name}" not found`)
  return fn(...(params as any))
}
