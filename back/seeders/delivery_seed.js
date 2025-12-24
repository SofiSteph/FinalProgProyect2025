'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('deliveries', [
      { 
        status: 'pending',
        dealer_user_id: 4 
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('deliveries', null, {});
  }
};
