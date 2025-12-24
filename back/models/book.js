/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - book_name
 *         - year_written
 *         - book_room_id
 *       properties:
 *         book_name:
 *           type: string
 *         year_written:
 *           type: integer
 *         available_copies:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         book_room_id:
 *           type: integer
 *         image:
 *           type: string
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Book = sequelize.define("book", {
  book_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year_written: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  available_copies: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Por defecto, no hay copias disponibles
    validate: {
      min: 0, // No puede haber menos de 0 copias
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
  paranoid: true,
});

module.exports = Book;
