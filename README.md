BACKEND (cd back)
* Pasos para levantar el servidor exitosamente: 
1- npm install
2- Crear .env con los datos correspondientes 
3- Crear carpeta para almacenar las imágenes: back/public/images
4- Comando "node app.js" para la inicialización y creación de las tablas en la BD "biblioteca"
5- Comando "npx sequelize-cli db:seed:all"para añadir los datos a la base de datos
6- Comando "npx sequelize-cli db:migrate" para realizar las respectivas migraciones

FRONTEND (cd front)
* Pasos para levantar el servidor exitosamente:
1- npm install
2- npm run dev

CALIDAD Y PRUEBAS DE SISTEMA
* Comandos para pruebas relacionadas con vitest (ejecutar desde el directorio front/):
  - Para pruebas unitarias (ejemplo, FormR.test.ts): npx vitest run tests/unit/FormR.tests.ts
  - Para pruebas e2e (ejemplo, FormsInput.tests.ts): npx vitest run tests/e2e/FormsInput.tests.ts
  - Nota: Asegúrate de estar en el directorio front/ antes de ejecutar los comandos.

SWAGGER: http://localhost:4000/api-docs/