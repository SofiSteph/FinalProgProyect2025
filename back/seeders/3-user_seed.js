'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        name: 'reader',
        password: 't',
        email: 'reader@example.com',
        username: 'userReader',
        role_id: 1
      },
      {
        name: 'dealer',
        password: 't',
        email: 'dealer@example.com',
        username: 'userDealer',
        role_id: 3,
      },
      {
        name: 'technician',
        password: 't',
        email: 'tech@example.com',
        username: 'userTech',
        role_id: 2,
        book_room_id: 1
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
