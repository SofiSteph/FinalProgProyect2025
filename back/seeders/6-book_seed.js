'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('books', [
      {
        book_name: '1984',
        year_written: 1949,
        available_copies: 10,
        book_room_id: 2, // Assuming book_rooms seeded first, id 2 is 'Sala de Ciencia Ficción'
        image: null
      },
      {
        book_name: 'To Kill a Mockingbird',
        year_written: 1960,
        available_copies: 5,
        book_room_id: 1, // id 1 is 'Sala de Literatura Clásica'
        image: null
      },
      {
        book_name: 'The Great Gatsby',
        year_written: 1925,
        available_copies: 8,
        book_room_id: 1,
        image: null
      },
      {
        book_name: 'Dune',
        year_written: 1965,
        available_copies: 12,
        book_room_id: 2,
        image: null
      },
      {
        book_name: 'Sapiens: A Brief History of Humankind',
        year_written: 2011,
        available_copies: 6,
        book_room_id: 3, // id 3 is 'Sala de Historia'
        image: null
      },
      {
        book_name: 'The Republic',
        year_written: -380,
        available_copies: 4,
        book_room_id: 5, // id 5 is 'Sala de Filosofía'
        image: null
      },
      {
        book_name: 'Leaves of Grass',
        year_written: 1855,
        available_copies: 3,
        book_room_id: 4, // id 4 is 'Sala de Poesía'
        image: null
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('books', null, {});
  }
};
