export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    nuxtApp.hooks.hook('app:mounted', () => {
      document.documentElement.dataset.hydrated = 'true'
    })
  }
})
