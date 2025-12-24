'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('books', [
      { 
        book_name: 'Sample Book 1', 
        year_written: 2020, 
        available_copies: 20,
        book_room_id: 1
      },
      { 
        book_name: 'Sample Book 2', 
        year_written: 2019, 
        available_copies: 3,
        book_room_id: 2 
      },
      { 
        book_name: 'Sample Book 3', 
        year_written: 2020, 
        available_copies: 20,
        book_room_id: 1
      },
      { 
        book_name: 'Sample Book 4', 
        year_written: 2019, 
        available_copies: 10,
        book_room_id: 2 
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('books', null, {});
  }
};
