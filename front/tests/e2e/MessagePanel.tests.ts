import { describe, it, expect, beforeAll } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'

describe('MessagePanel test', () => {

  beforeAll(async () => {
    // Levanta Nuxt + browser
    await setup({
      host: "http://localhost:3000",
      browser: true
    })
  })

  it('MessagePanel displays messages and can be closed', async () => {
    // Abrir pestaña en incógnito
    const page = await createPage()
    // Navegar a la página /reader/books/all donde se muestra un mensaje de bienvenida
    await page.goto('http://localhost:3000/reader/books/all')
    // Esperar a que el panel de mensajes aparezca
    await page.waitForSelector('.message-panel', { timeout: 5000 })
    // Verificar que el panel está visible
    expect(await page.locator('.message-panel').isVisible()).toBe(true)
    // Verificar que el mensaje de bienvenida está presente
    const messageText = await page.locator('.message').textContent()
    expect(messageText).toContain('Bienvenido a la sala de libros')
    // Verificar que el botón de cerrar está presente
    expect(await page.locator('.close-btn').isVisible()).toBe(true)
    // Hacer clic en el botón de cerrar
    await page.locator('.close-btn').click()
    // Verificar que el panel ya no está visible
    expect(await page.locator('.message-panel').isVisible()).toBe(false)
  })
})
