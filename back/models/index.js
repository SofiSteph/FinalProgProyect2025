// models/index.js
const MainAuthor = require("./main_author");
const Book = require("./book");
const BookRoom = require("./book_room");
const Role = require("./role");
const User = require("./user");
const Loan = require("./loan");
const KeyWord = require("./key_word")
const Delivery = require("./delivery")

// Many-to-Many relationship between MainAuthor and Book
MainAuthor.belongsToMany(Book, { through: 'AuthorBook', foreignKey: 'author_id', onDelete: 'CASCADE', timestamps: false});
Book.belongsToMany(MainAuthor, { through: 'AuthorBook', foreignKey: 'book_id', onDelete: 'CASCADE', timestamps: false});

// Un Libro pertenece a un Salón
Book.belongsTo(BookRoom, { foreignKey: 'book_room_id', onDelete: 'CASCADE' });
BookRoom.hasMany(Book, { foreignKey: 'book_room_id'});

// Un Usuario (técnico de salón) pertenece a un Salón
User.belongsTo(BookRoom, { foreignKey: 'book_room_id', allowNull: true, onDelete: 'CASCADE'});
BookRoom.hasMany(User, { foreignKey: 'book_room_id'});

// Un usuario (lector) puede tener muchos Préstamos
User.hasMany(Loan, { foreignKey: 'reader_user_id', as: 'readerLoans'});
Loan.belongsTo(User, { foreignKey: 'reader_user_id', as: 'reader', onDelete: 'CASCADE'});

// Un usuario (técnico de salón) puede validar muchos Préstamos
User.hasMany(Loan, { foreignKey: 'room_technician_user_id', as: 'technicianLoans'});
Loan.belongsTo(User, { foreignKey: 'room_technician_user_id', as: 'technician', onDelete: 'CASCADE'});

// Un Préstamo es de un Libro
Book.hasMany(Loan, { foreignKey: 'book_id'});
Loan.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE'});

//Many-to-Many relationship between KeyWord and Book
KeyWord.belongsToMany(Book, { through: 'KeywordBook', foreignKey: 'keyword_id', onDelete: 'CASCADE', timestamps: false});
Book.belongsToMany(KeyWord, { through: 'KeywordBook', foreignKey: 'book_id', onDelete: 'CASCADE', timestamps: false});

//Un usuario tiene un rol
User.belongsTo(Role, {foreignKey: 'role_id', onDelete: 'CASCADE'});

// Un usuario (repartidor) puede realizar muchas entregas
User.hasMany(Delivery, { foreignKey: 'dealer_user_id'});
Delivery.belongsTo(User, { foreignKey: 'dealer_user_id', onDelete: 'CASCADE'});

// Una entrega está compuesta de muchos préstamos
Delivery.hasMany(Loan, { foreignKey: 'delivery_id'});
Loan.belongsTo(Delivery, { foreignKey: 'delivery_id', allowNull: true, onDelete: 'CASCADE'});

module.exports = {
  Book,
  BookRoom,
  User,
  Loan,
  KeyWord,
  Role,
  Delivery,
  MainAuthor
};
