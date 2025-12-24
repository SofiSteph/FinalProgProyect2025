'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('key_words', [
      { key_word_name: 'Fiction' },
      { key_word_name: 'Science' }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('key_words', null, {});
  }
};
