'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('deliveries', [
      {
        status: 'pendiente',
        dealer_user_id: 2 
      },
      {
        status: 'entregado',
        dealer_user_id: 2
      },
      {
        status: 'en camino',
        dealer_user_id: 2
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('deliveries', null, {});
  }
};
