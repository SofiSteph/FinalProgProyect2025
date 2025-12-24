// 1) Importaciones e inicializaciones
require("./models/index")
require("./logger/logger")

const express = require('express');
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const sequelize = require('./helpers/database');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const port = 4000;

// 1) CORS
const cors = require('cors');
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// 2) JSON parsing
app.use(express.json());

// 3) Swagger http://localhost:4000/api-docs/
const SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Germany Travel Blog', version: '1.0.0', description: 'API Germany Travel Blog' },
  },
  apis: ['./routes/*', './models/*'],
};
const SwaggerSpec = swaggerJsdoc(SwaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerSpec));

// 4) Permitir procesamiento de datos de texto de Multer por express 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// 5) Definción de rutas
const BookRoomRoutes = require("./routes/book_room_routes");
const BookRoutes = require("./routes/book_routes");
const KeyWordRoutes = require("./routes/key_word_routes");
const MainAuthorRoutes = require("./routes/main_author_routes");
const UserRoutes = require("./routes/user_routes");
const LoanRoutes = require("./routes/loan_routes");
const DeliveryRoutes = require("./routes/delivery_routes");
const RoleRoutes = require("./routes/role_routes");

app.use('/api/book_rooms', BookRoomRoutes);
app.use('/api/books', BookRoutes);
app.use('/api/key_words', KeyWordRoutes);
app.use('/api/main_authors', MainAuthorRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/loans', LoanRoutes);
app.use('/api/deliveries', DeliveryRoutes);
app.use('/api/roles', RoleRoutes);

// 6) Manejador de errores
app.use(errorHandler); 

// 7) Inicializar servidor y DB
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`)
});

// 8) Sincronización de los modelos
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Todos los modelos se sincronizaron correctamente.");
  })
  .catch((err) => {
    console.log("Ha ocurrido un error al sincronizar los modelos: ", err);
  });