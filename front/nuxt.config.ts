// https://nuxt.com/docs/api/configuration/nuxt-config
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3000
  },
  modules: [
    '@nuxt/image',
    '@nuxtjs/seo',
  ],
  site: {
    url: 'http://localhost:3000',
    name: 'Biblioteca',
    description: 'A Nuxt.js project for the final programming project 2025',
  },
  css: ['~/assets/global.css'],
})

