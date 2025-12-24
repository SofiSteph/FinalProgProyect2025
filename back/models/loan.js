/**
 * @swagger
 * components:
 *   schemas:
 *     Loan:
 *       type: object
 *       required:
 *         - loan_start_date
 *         - loan_end_date
 *         - reader_user_id
 *         - room_technician_user_id
 *         - book_id
 *         - delivery_id
 *       properties:
 *         loan_start_date:
 *           type: string
 *           format: date-time
 *         loan_end_date:
 *           type: string
 *           format: date-time
 *         validated:
 *           type: boolean
 *           default: false
 *         reader_user_id:
 *           type: integer
 *         room_technician_user_id:
 *           type: integer
 *         book_id:
 *           type: integer
 *         delivery_id:
 *           type: integer
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Loan = sequelize.define("loan", {
  loan_start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  loan_end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  validated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamps: false,
  paranoid: true,
  validate: {
    isEndDateValid() {  // Custom validation to ensure end date is after start date
      if (this.loan_end_date <= this.loan_start_date) {
         throw new Error("Loan end date must be after the start date.");
      }
    }
  }
});

module.exports = Loan;
