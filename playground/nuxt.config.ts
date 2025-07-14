export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-06-24',
  nitro: {
    experimental: {
      asyncContext: true,
    }
  },
  apex: {
    ignore: ['api/fake-data.get.ts']
  }
})
