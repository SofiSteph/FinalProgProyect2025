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
    "@sidebase/nuxt-auth",
  ],
  site: {
    url: 'http://localhost:3000',
    name: 'Biblioteca',
    description: 'A Nuxt.js project for the final programming project 2025',
    defaultLocale: "es",
    indexable: true,
  },
  runtimeConfig: {
    public: {
      backend_url: process.env.BACKEND_URL,
    },
  },
  auth: {
    baseURL: process.env.BACKEND_URL || "http://localhost:4000",
    provider: {
      type: "local",
      endpoints: {
        signIn: {
          path: "api/users/login",
          method: "post",
        },
        signUp: false,
        signOut: false,
        getSession: {
          path: "api/users/session",
          method: "get",
        },
      },
      pages: {
        login: "/login",
      },
      session: {
          dataType: {
          id: "number",
          email: "string",
          nombre: "string",
          usuario: "object",
        },
        dataResponsePointer: "/user",
      },
      token: {
        signInResponseTokenPointer: "/accessToken",
        maxAgeInSeconds: 3600,
        type: "Bearer",
        headerName: "Authorization",
        cookieName: "auth_token",
      },
      refresh: {
        isEnabled: true,
        endpoint: {
          path: "/user/refresh-token",
          method: "post",
        },
        refreshOnlyToken: true,
        token: {
          signInResponseRefreshTokenPointer: "/refreshToken",
          refreshRequestTokenPointer: "/refreshToken",
          maxAgeInSeconds: 604800,
          cookieName: "refresh_token",
        },
      },
    },
     globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: true,
    },
  },
  css: ['~/assets/global.css'],
})

