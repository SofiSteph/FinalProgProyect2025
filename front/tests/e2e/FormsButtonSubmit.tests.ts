import { describe, it, expect, beforeAll } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'

describe('FormsButtonSubmit test', () => {

  beforeAll(async () => {
    // Levanta Nuxt + browser
    await setup({
      host: "http://localhost:3000",
      browser: true
    })
  })

  it('Button Submit', async () => {

    // Abrir pestaña en incógnito
    const page = await createPage()
    // Navegar a la página de login donde se usa FormsButtonSubmit
    await page.goto('http://localhost:3000/login')
    // Verificar que el botón submit está presente
    expect(await page.locator('button[type="submit"]').isVisible()).toBe(true)
    // Verificar que el texto del botón es correcto
    expect(await page.locator('button[type="submit"]').textContent()).toBe(' Aceptar ')
    // Hacer clic en el botón (sin verificar navegación ya que es submit)
    await page.locator('button[type="submit"]').click()
    // Nota: El clic en submit puede intentar enviar el formulario, pero sin datos válidos no procederá

  })
})
