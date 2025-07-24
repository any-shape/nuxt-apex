// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/test-utils"],
  compatibilityDate: '2025-06-24',
  build: {
    transpile: []
  },
  vite: {
    build: { target: 'es2022', minify: 'esbuild', outDir: 'dist' },
    optimizeDeps: { include: ['zod', 'xxhash-wasm'] }
  },
  devtools: { enabled: true },
})
