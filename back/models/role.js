/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Role = sequelize.define("role", {
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  paranoid: true,
});

module.exports = Role;
