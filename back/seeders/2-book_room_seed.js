'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('book_rooms', [
      { room_name: 'Sala de Literatura Clásica' },
      { room_name: 'Sala de Ciencia Ficción' },
      { room_name: 'Sala de Historia' },
      { room_name: 'Sala de Poesía' },
      { room_name: 'Sala de Filosofía' }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('book_rooms', null, {});
  }
};
