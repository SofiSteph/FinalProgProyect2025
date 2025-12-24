/**
 * @swagger
 * components:
 *   schemas:
 *     BookRoom:
 *       type: object
 *       required:
 *         - room_name
 *       properties:
 *         room_name:
 *           type: string
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const BookRoom = sequelize.define("book_room", {
  room_name: {  
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  paranoid: true,
});

module.exports = BookRoom;