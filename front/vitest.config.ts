import {defineVitestConfig} from "@nuxt/test-utils/config"

export default defineVitestConfig({
    test: {
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        domEnvironment: "happy-dom"
      }
    },
    globals: true,
    test: {
      //60 segundos de paciencia
      testTimeout: 60000,
      include: ["tests/e2e/**/*.tests.ts"]
    }
  }
})