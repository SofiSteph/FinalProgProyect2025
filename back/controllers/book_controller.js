const { Book, BookRoom, MainAuthor, Loan, KeyWord } = require('../models/index');
const { createMainAuthor, associateBookWithAuthor } = require('./main_author_controller');
const { createKeyWord, associateBookWithKeyWord } = require('./key_word_controller');
let e;

// Crear un Book
const createBook = async ({ book_name, year_written, available_copies, book_room_id, image }) => {
  try {
    // Validaciones
    if (!book_name) {
      const e = new Error('book_name es requerido');
      e.statusCode = 400;
      throw e;
    }
    if (!year_written) {
      const e = new Error('year_written es requerido');
      e.statusCode = 400;
      throw e;
    }
    if (available_copies === undefined || available_copies < 0) {
      const e = new Error('available_copies debe ser mayor o igual a 0');
      e.statusCode = 400;
      throw e;
    }
    if (!book_room_id) {
      const e = new Error('book_room_id es requerido');
      e.statusCode = 400;
      throw e;
    }

    // Crear Book
    const nuevoBook = await Book.create({
      book_name,
      year_written,
      available_copies,
      book_room_id,
      image
    });

    return nuevoBook;
  } catch (error) {
    console.error(error);
    const err = error instanceof Error ? error : new Error(String(error));
    err.statusCode = Number(error.statusCode) || 500;
    throw err;
  }
};

// Obtener todos los Books
const getAllBooks = async () => {
  try {
    const books = await Book.findAll({ 
      include: [{ model: BookRoom },
                { model: MainAuthor },
                { model: KeyWord }
              ] });
    return books;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los Books: ${error.message}`);
  }
};

// Obtener un Book por ID
const getBookById = async (id) => {
  try {
    const book = await Book.findByPk(id, { include: [{ model: BookRoom }, { model: MainAuthor }, { model: KeyWord }, { model: BookRoom}] });

    if (!book) {
      throw new Error('Book no encontrado');
    }

    return book;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el Book: ${error.message}`);
  }
};

// Actualizar un Book por ID
const updateBook = async (id, { book_name, year_written, available_copies, image }) => {
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      throw new Error('Book no encontrado');
    }
    if (!book_name) {
      throw new Error('book_name es requerido');
    }
    if (!year_written) {
      throw new Error('year_written es requerido');
    }
    if (available_copies !== undefined && available_copies < 0) {
      throw new Error('available_copies debe ser mayor o igual a 0');
    }

    book.book_name = book_name;
    book.year_written = year_written;
    if (available_copies !== undefined) {
      book.available_copies = available_copies;
    }
    if (image !== undefined) {
      book.image = image;
    }

    await book.save();
    return book;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al actualizar el Book: ${error.message}`);
  }
};

// Prestar un Book por ID
const toLoan = async (id, { loan_start_date, loan_end_date, reader_user_id, room_technician_user_id, delivery_id }) => {
  try {
    const book = await Book.findByPk(id);

    if (!book) {
      throw new Error('Book no encontrado');
    }

    if (book.available_copies <= 0) {
      throw new Error('No hay copias disponibles para prestar');
    }

    if (!loan_start_date) {
      throw new Error('loan_start_date es requerido');
    }

    if (!loan_end_date) {
      throw new Error('loan_end_date es requerido');
    }

    if (!reader_user_id) {
      throw new Error('reader_user_id es requerido');
    }

    if (!room_technician_user_id) {
      throw new Error('room_technician_user_id es requerido');
    }

    const nuevoLoan = await Loan.create({ loan_start_date, loan_end_date, reader_user_id, room_technician_user_id, book_id: id, delivery_id });
    book.available_copies -= 1;
    await book.save();

    return nuevoLoan;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al prestar el Book: ${error.message}`);
  }
};

// Eliminar un Book por ID
const deleteBook = async (id) => {
  try {
    const book = await Book.findByPk(id);

    if (!book) {
      throw new Error('Book no encontrado');
    } 

    await book.destroy();
    return { message: 'Book eliminado exitosamente' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al eliminar el Book: ${error.message}`);
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  toLoan,
  updateBook,
  deleteBook,
};
