'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        password: 'admin123',
        email: 'admin@example.com',
        username: 'admin',
        role_id: 1,
        book_room_id: null
      },
      {
        name: 'Reader',
        password: 'reader123',
        email: 'reader@example.com',
        username: 'reader',
        role_id: 2,
        book_room_id: null
      },
      {
        name: 'Tech',
        password: 'tech123',
        email: 'tech@example.com',
        username: 'tech',
        role_id: 3,
        book_room_id: 1
      },
      {
        name: 'Dealer',
        password: 'dealer123',
        email: 'dealer@example.com',
        username: 'dealer',
        role_id: 4,
        book_room_id: null
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
