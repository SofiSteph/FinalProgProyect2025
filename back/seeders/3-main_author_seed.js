'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('main_authors', [
      { author_name: 'Author One', country_of_origin: 'Country1' },
      { author_name: 'Author Two', country_of_origin: 'Country2' }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('main_authors', null, {});
  }
};
