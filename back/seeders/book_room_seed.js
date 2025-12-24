'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('book_rooms', [
      { room_name: 'Fiction Room' },
      { room_name: 'Science Room' }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('book_rooms', null, {});
  }
};
