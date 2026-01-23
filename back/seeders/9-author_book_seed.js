'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('AuthorBook', [
      { author_id: 1, book_id: 1 }, // Author One writes 1984
      { author_id: 1, book_id: 2 }, // Author One writes To Kill a Mockingbird
      { author_id: 2, book_id: 3 }, // Author Two writes The Great Gatsby
      { author_id: 2, book_id: 4 }, // Author Two writes Dune
      { author_id: 1, book_id: 5 }, // Author One writes Sapiens
      { author_id: 2, book_id: 6 }, // Author Two writes The Republic
      { author_id: 1, book_id: 7 }  // Author One writes Leaves of Grass
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('author_books', null, {});
  }
};
