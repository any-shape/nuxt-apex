export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-06-24',
  apex: {
    ignore: ['api/fake-data.get.ts']
  }
})
