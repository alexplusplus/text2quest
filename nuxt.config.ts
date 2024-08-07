// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({modules: [
  '@nuxtjs/tailwindcss','@nuxt/icon'
],
  compatibilityDate: '2024-04-03',
  app: {
    head: {
      title: "Text2Quest"
    }
  },
  devtools: { enabled: true }
})