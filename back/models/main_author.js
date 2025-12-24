/**
 * @swagger
 * components:
 *   schemas:
 *     MainAuthor:
 *       type: object
 *       required:
 *         - author_name
 *       properties:
 *         author_name:
 *           type: string
 *         country_of_origin:
 *           type: string
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const MainAuthor = sequelize.define("main_author", {
  author_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country_of_origin: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
}, {
  timestamps: false,
  paranoid: true,
});

module.exports = MainAuthor;
