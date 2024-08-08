// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', "nuxt-gtag", "@vite-pwa/nuxt"],
  compatibilityDate: '2024-04-03',
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Text2Quest',
      start_url: 'https://text2quest.netlify.app/',
      display : 'standalone',
      short_name: 'Text2Quest',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  app: {
    head: {
      title: "Text2Quest"
    }
  },
  devtools: { enabled: true }
})