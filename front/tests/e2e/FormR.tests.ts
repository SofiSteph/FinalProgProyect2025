import { describe, it, expect, beforeAll } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'

describe('FormR test', () => {

  beforeAll(async () => {
    // Levanta Nuxt + browser
    await setup({
      host: "http://localhost:3000",
      browser: true
    })
  })

  it('FormR inputs and form submission', async () => {
    // Abrir pestaña en incógnito
    const page = await createPage()
    // Navegar a la página principal donde se usa FormR
    await page.goto('http://localhost:3000/')

    // Llenar los inputs
    await page.fill('#nombre', 'Test Name')
    await page.fill('#email', 'test@example.com')
    await page.fill('#usuario', 'testuser')
    await page.fill('#contraseña', 'testpass')

    // Seleccionar un rol (por ejemplo, reader)
    await page.selectOption('#rol', 'reader')

    // Verificar botón Aceptar
    await page.click('text=Aceptar')
  })
})
