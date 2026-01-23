'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('KeywordBook', [
      { keyword_id: 1, book_id: 1 }, // Fiction - 1984
      { keyword_id: 1, book_id: 2 }, // Fiction - To Kill a Mockingbird
      { keyword_id: 1, book_id: 3 }, // Fiction - The Great Gatsby
      { keyword_id: 1, book_id: 4 }, // Fiction - Dune
      { keyword_id: 2, book_id: 4 }, // Science - Dune
      { keyword_id: 2, book_id: 5 }, // Science - Sapiens
      { keyword_id: 1, book_id: 6 }  // Science - The Republic
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('keyword_books', null, {});
  }
};
