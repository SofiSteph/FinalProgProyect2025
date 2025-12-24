'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('loans', [
      { 
        loan_start_date: new Date(),
        loan_end_date: new Date(Date.now() + 86400000), // 1 day later
        validated: false,
        reader_user_id: 2,
        room_technician_user_id: 3,
        book_id: 1,
        delivery_id: 1 
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('loans', null, {});
  }
};
