import { describe, it, expect, beforeAll } from 'vitest'
import {setup, createPage} from '@nuxt/test-utils/e2e'

describe('FormsInput test', () =>{

  beforeAll(async () => {
    //levanta nuxt + browser
    await setup({
      host: "http://localhost:3000",
      browser: true
    })
  })

  it('Inputs', async () =>{

    //Abrir pestaña en incógnito
    const page = await createPage()
    // Navegar a la página de login donde se usa FormsInput
    await page.goto('http://localhost:3000/login')
    // Verificar que los inputs están presentes
    expect(await page.locator('#usuario').isVisible()).toBe(true)
    expect(await page.locator('#contraseña').isVisible()).toBe(true)
    // Llenar los inputs
    await page.fill('#usuario', 'testuser')
    await page.fill('#contraseña', 'testpass')
    // Verificar que los valores se han establecido correctamente
    expect(await page.locator('#usuario').inputValue()).toBe('testuser')
    expect(await page.locator('#contraseña').inputValue()).toBe('testpass')

  })
})
