const modules = import.meta.glob('../node_modules/.nuxt-apex/composables/useTFetch*.ts', { eager: true })

type ModuleMap = {
  [P in keyof typeof modules as keyof typeof modules[P]]: (
    ...args: any[]
  ) => any
}

const registry = Object.entries(modules).reduce((acc, [path, mod]) => {
  Object.assign(acc, mod as any)
  return acc
}, {} as ModuleMap)

export async function invokeComposable<K extends keyof ModuleMap>(name: K, params: Parameters<ModuleMap[K]>): Promise<ReturnType<ModuleMap[K]>> {
  // @ts-ignore
  const fn = registry['useTFetch'+name+'Async'] as Function
  if (!fn) throw new Error(`Composable "${name}" not found`)
  return fn(params)
}
