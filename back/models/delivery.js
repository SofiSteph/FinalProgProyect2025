/**
 * @swagger
 * components:
 *   schemas:
 *     Delivery:
 *       type: object
 *       required:
 *         - status
 *         - dealer_user_id
 *       properties:
 *         status:
 *           type: string
 *         dealer_user_id:
 *           type: integer
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Delivery = sequelize.define("delivery", {
  status: {  
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  paranoid: true,
});

module.exports = Delivery;