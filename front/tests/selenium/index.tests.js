import {By, Builder, Browser, until} from 'selenium-webdriver';
import assert from "assert";

(async function indexTest() {
  let driver;

  try {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().setTimeouts({implicit: 500});

    // Test en página de login
    await driver.get('http://localhost:3000/login');

    let title = await driver.getTitle();
    assert.equal("Inicio de sesión | Biblioteca", title);

    // Probar input de usuario
    let usuarioInput = await driver.findElement(By.id('usuario'));
    await usuarioInput.sendKeys('userReader');
    let usuarioValue = await usuarioInput.getAttribute('value');
    assert.equal("userReader", usuarioValue);

    // Probar input de contraseña
    let contraseñaInput = await driver.findElement(By.id('contraseña'));
    await contraseñaInput.sendKeys('t');
    let contraseñaValue = await contraseñaInput.getAttribute('value');
    assert.equal("t", contraseñaValue);

    // Presionar botón de submit para navegar a reader/books/all
    let submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await driver.wait(until.elementIsVisible(submitButton), 5000);
    await driver.wait(until.elementIsEnabled(submitButton), 5000);
    await submitButton.click();

    // Esperar navegación a reader/books/all
    await driver.get('http://localhost:3000/reader/books/all');
    title = await driver.getTitle();
    assert.equal("Libros | Biblioteca", title);

    // Navegar a reader/deliveries/all
    await driver.get('http://localhost:3000/reader/deliveries/all');
    title = await driver.getTitle();
    assert.equal("Entregas | Biblioteca", title);

  } catch (e) {
    console.log(e)
  } finally {
    await driver.quit();
  }
}())
