const Book = require('../models/book');
const BookRoom = require('../models/book_room');
const MainAuthor = require('../models/main_author');
const Loan = require('../models/loan');
const KeyWord = require('../models/key_word');
const { createMainAuthor, associateBookWithAuthor } = require('./main_author_controller');
const { createKeyWord, associateBookWithKeyWord } = require('./key_word_controller');
let e;
// Crear un Book
const createBook = async ({ book_name, year_written, available_copies, book_room_id, main_author, key_word, image }) => {
  
  try {
    if (!book_name) {
      e = new Error('book_name es requerido');
      e.statusCode = 400;
      throw e;
    };
    if (!year_written) {
      e = new Error('year_writen es requerido');
      e.statusCode = 400;
      throw e;
    };
    if (available_copies === undefined || available_copies < 0) {
      e = new Error('available_copies debe ser mayor o igual que 0');
      e.statusCode = 400;
      throw e;
    };
    if (!book_room_id){
      e = new Error('book_room_id es requerido');
      e.statusCode = 400;
      throw e;
    };
    if (!main_author || !main_author.author_name){
      e = new Error('main_author es requerido');
      e.statusCode = 400;
      throw e;
    };
    if (!key_word || !key_word.key_word_name){
      e = new Error('key_word es requerido');
      e.statusCode = 400;
      throw e;
    };

    // Verificar/crear main author
    let mainAuthorId;
    const existingMainAuthor = await MainAuthor.findOne({ where: { author_name: main_author.author_name } });
    if (existingMainAuthor) {
      mainAuthorId = existingMainAuthor.id;
    } else {
      const newMainAuthor = await createMainAuthor({
        author_name: main_author.author_name,
        country_of_origin: main_author.country_of_origin || null
      });
      mainAuthorId = newMainAuthor.id;
    }

    // Verificar/crear key word
    let keyWordId;
    const existingKeyWord = await KeyWord.findOne({ where: { key_word_name: key_word.key_word_name } });
    if (existingKeyWord) {
      keyWordId = existingKeyWord.id;
    } else {
      const newKeyWord = await createKeyWord({ key_word_name: key_word.key_word_name });
      keyWordId = newKeyWord.id;
    }

    // Crear Book
    const nuevoBook = await Book.create({
      book_name,
      year_written,
      available_copies,
      book_room_id,
      main_author_id: mainAuthorId,
      image 
    });

    if (associateBookWithKeyWord) await associateBookWithKeyWord(nuevoBook.id, keyWordId);
    if (associateBookWithAuthor) await associateBookWithAuthor(nuevoBook.id, mainAuthorId);

    return nuevoBook;
  } catch (error) {
  console.error(error);
  // Si el error ya tiene statusCode conservarlo; si no asignar 500
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
const updateBook = async (id, { book_name, year_written, available_copies, main_author, key_word, image }) => {
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
    if (main_author !== undefined) {
      // Verificar si el main_author existe, si no, crearlo
      let mainAuthorId;
      const existingMainAuthor = await MainAuthor.findOne({ where: { author_name: main_author.author_name } });
      if (existingMainAuthor) {
        mainAuthorId = existingMainAuthor.id;
      } else {
        const newMainAuthor = await createMainAuthor({ author_name: main_author.author_name, country_of_origin: main_author.country_of_origin });
        mainAuthorId = newMainAuthor.id;
      }
      book.main_author_id = mainAuthorId;
    }
      book.main_author_id = mainAuthorId;
    if (key_word !== undefined) {
      // Verificar si la key_word existe, si no, crearla
      let keyWordId;
      const existingKeyWord = await KeyWord.findOne({ where: { key_word_name: key_word.key_word_name } });
      if (existingKeyWord) {
        keyWordId = existingKeyWord.id;
      } else {
        const newKeyWord = await createKeyWord({ key_word_name: key_word.key_word_name });
        keyWordId = newKeyWord.id;
      }
      // Asignar la key_word al libro a través de la tabla intermedia
      await book.addKeyWord(keyWordId);
    }
    await book.save();

    return book;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al actualizar el Book: ${error.message}`);
  };
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
