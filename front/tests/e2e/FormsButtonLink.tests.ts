import { describe, it, expect, beforeAll } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'

describe('FormsButtonLink test', () => {

  beforeAll(async () => {
    // Levanta Nuxt + browser
    await setup({
      host: "http://localhost:3000",
      browser: true
    })
  })

  it('Button Link', async () => {

    // Abrir pestaña en incógnito
    const page = await createPage()
    // Navegar a la página de login donde se usa FormsButtonLink
    await page.goto('http://localhost:3000/login')
    // Verificar que el botón link está presente
    expect(await page.locator('a[href="/"]').isVisible()).toBe(true)
    // Verificar que el texto del botón es correcto
    expect(await page.locator('a[href="/"]').textContent()).toBe('Registrarse')
    // Hacer clic en el botón
    await page.locator('a[href="/"]').click()
    // Verificar que se ha navegado a la página principal
    expect(page.url()).toBe('http://localhost:3000/')

  })
})
