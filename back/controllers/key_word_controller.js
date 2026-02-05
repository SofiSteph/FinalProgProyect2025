const { KeyWord, Book } = require('../models/index');

// Crear un KeyWord
const createKeyWord = async ({ key_word_name }) => {
  try {
    if (!key_word_name) {
      throw new Error('key_word_name es requerido');
    }

    const nuevoKeyWord = await KeyWord.create({ key_word_name });
    return nuevoKeyWord;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al crear el KeyWord: ${error.message}`);
  }
};

// Obtener todos los KeyWords
const getAllKeyWords = async () => {
  try {
    const keyWords = await KeyWord.findAll();
    return keyWords;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los KeyWords: ${error.message}`);
  }
};

// Obtener un KeyWord por ID
const getKeyWordById = async (id) => {
  try {
    const keyWord = await KeyWord.findByPk(id);

    if (!keyWord) {
      throw new Error('KeyWord no encontrado');
    }

    return keyWord;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el KeyWord: ${error.message}`);
  }
};

// Actualizar un KeyWord por ID
const updateKeyWord = async (id, { key_word_name }) => {
  try {
    const keyWord = await KeyWord.findByPk(id);

    if (!keyWord) {
      throw new Error('KeyWord no encontrado');
    }

    if (!key_word_name) {
      throw new Error('key_word_name es requerido');
    }

    keyWord.key_word_name = key_word_name;
    await keyWord.save();

    return keyWord;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al actualizar el KeyWord: ${error.message}`);
  }
};

// Eliminar un KeyWord por ID
const deleteKeyWord = async (id) => {
  try {
    const keyWord = await KeyWord.findByPk(id);

    if (!keyWord) {
      throw new Error('KeyWord no encontrado');
    }

    await keyWord.destroy();
    return { message: 'KeyWord eliminado exitosamente' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al eliminar el KeyWord: ${error.message}`);
  }
};

// Establecer relación entre un libro y una palabra clave
const associateBookWithKeyWord = async (book_id, keyword_id) => {
  try {
    const book = await Book.findByPk(book_id);
    if (!book) {
      throw new Error('Libro no encontrado');
    }

    const keyword = await KeyWord.findByPk(keyword_id);
    if (!keyword) {
      throw new Error('Palabra clave no encontrada');
    }

    await keyword.addBook(book);
    return { message: 'Relación establecida exitosamente entre el libro y la palabra clave' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al establecer la relación: ${error.message}`);
  }
};

// Obtener un KeyWord por nombre
const getKeyWordByName = async (key_word_name) => {
  try {
    if (!key_word_name) {
      throw new Error('key_word_name es requerido');
    }

    const keyWord = await KeyWord.findOne({
      where: { key_word_name }
    });

    if (!keyWord) {
      throw new Error('KeyWord no encontrado');
    }

    return keyWord;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el KeyWord por nombre: ${error.message}`);
  }
};

// Obtener todos los libros asociados a una palabra clave
const getBooksByKeyWord = async (key_word_name) => {
  try {
    if (!key_word_name) {
      throw new Error('key_word_name es requerido');
    }

    const keyWord = await KeyWord.findOne({
      where: { key_word_name },
      include: Book
    });

    if (!keyWord) {
      throw new Error('Palabra clave no encontrada');
    }

    return keyWord.Books;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los libros: ${error.message}`);
  }
};

module.exports = {
  createKeyWord,
  getAllKeyWords,
  getKeyWordById,
  updateKeyWord,
  deleteKeyWord,
  associateBookWithKeyWord,
  getBooksByKeyWord,
  getKeyWordByName
};
