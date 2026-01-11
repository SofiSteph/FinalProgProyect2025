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
    //60 segundos de paciencia
    testTimeout: 60000,
    include: ["tests/e2e/*.tests.ts", "tests/unit/*.tests.ts"]
  }
})
