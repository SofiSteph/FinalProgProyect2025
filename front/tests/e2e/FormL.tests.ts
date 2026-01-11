import { describe, it, expect, beforeAll } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'

describe('FormL test', () => {
    
  beforeAll(async () => {
    // Levanta Nuxt + browser
    await setup({
      host: "http://localhost:3000",
      browser: true
    })
  })

  it('FormL inputs and form submission', async () => {
    // Abrir pestaña en incógnito
    const page = await createPage()
    // Navegar a la página de login donde se usa FormL
    await page.goto('http://localhost:3000/login')

    // Llenar los inputs
    await page.fill('#usuario', 'testuser')
    await page.fill('#contraseña', 'testpass')

    // Verificar botón Registrarse
    await page.click('text=Registrarse')
    await expect(page.url()).toBe('http://localhost:3000/')

    // Volver a la página de login
    await page.goto('http://localhost:3000/login')

    // Llenar los inputs de nuevo
    await page.fill('#usuario', 'testuser')
    await page.fill('#contraseña', 'testpass')

    // Verificar botón Aceptar
    await page.click('text=Aceptar')
  })
})
