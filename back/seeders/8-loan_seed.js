'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('loans', [
      {
        loan_start_date: new Date('2023-10-01'),
        loan_end_date: new Date('2023-10-08'),
        validated: false,
        reader_user_id: 1, 
        room_technician_user_id: 3, 
        book_id: 1, 
        delivery_id: 1 
      },
      {
        loan_start_date: new Date('2023-10-02'),
        loan_end_date: new Date('2023-10-09'),
        validated: true,
        reader_user_id: 1,
        room_technician_user_id: 3,
        book_id: 2,
        delivery_id: 2
      },
      {
        loan_start_date: new Date('2023-10-03'),
        loan_end_date: new Date('2023-10-10'),
        validated: false,
        reader_user_id: 1,
        room_technician_user_id: 3,
        book_id: 3,
        delivery_id: null 
      },
      {
        loan_start_date: new Date('2023-10-04'),
        loan_end_date: new Date('2023-10-11'),
        validated: true,
        reader_user_id: 1,
        room_technician_user_id: 3,
        book_id: 4,
        delivery_id: 3
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('loans', null, {});
  }
};
