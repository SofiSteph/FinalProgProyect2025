require("dotenv").config(); // Load environment variables
const Sequelize = require("sequelize");


// Importamos las variables de entorno para la conexión a la base de datos
const databaseName = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;
const dialect = process.env.DB_DIALECT;
const host = process.env.HOST;
const port = process.env.DB_PORT


// Conexión a la base de datos
const sequelize = new Sequelize(databaseName, user, password, {
  host: host,
  dialect: dialect, 
  port: port,
  logging: false,
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? { 
      require: true, 
      rejectUnauthorized: false, 
    } : false, 
  },
});

// Función para comprobar que salió bien la conexión con la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida correctamente.");
  })
  .catch((err) => {
    console.error("Error al conectarse a la base de datos:", err); 
  });

module.exports = sequelize;