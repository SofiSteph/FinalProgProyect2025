/**
 * @swagger
 * components:
 *   schemas:
 *     KeyWord:
 *       type: object
 *       required:
 *         - key_word_name
 *       properties:
 *         key_word_name:
 *           type: string
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const KeyWord = sequelize.define("key_word", {
  key_word_name: {  
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  paranoid: true,
});

module.exports = KeyWord;
