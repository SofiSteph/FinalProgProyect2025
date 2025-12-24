// Import the MainAuthor and Book models
const { MainAuthor, Book } = require('../models/index');


// Crear un MainAuthor
const createMainAuthor = async ({ author_name, country_of_origin }) => {
  try {
    if (!author_name) {
      throw new Error('author_name es requerido');
    }

    const nuevoMainAuthor = await MainAuthor.create({ author_name, country_of_origin });
    return nuevoMainAuthor;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al crear el MainAuthor: ${error.message}`);
  }
};

// Obtener todos los MainAuthors
const getAllMainAuthors = async () => {
  try {
    const mainAuthors = await MainAuthor.findAll();
    return mainAuthors;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los MainAuthors: ${error.message}`);
  }
};

// Obtener un MainAuthor por ID
const getMainAuthorById = async (id) => {
  try {
    const mainAuthor = await MainAuthor.findByPk(id);

    if (!mainAuthor) {
      throw new Error('MainAuthor no encontrado');
    }

    return mainAuthor;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el MainAuthor: ${error.message}`);
  }
};

// Actualizar un MainAuthor por ID
const updateMainAuthor = async (id, { author_name, country_of_origin }) => {
  try {
    const mainAuthor = await MainAuthor.findByPk(id);

    if (!mainAuthor) {
      throw new Error('MainAuthor no encontrado');
    }

    if (!author_name) {
      throw new Error('author_name es requerido');
    }

    mainAuthor.author_name = author_name;
    if (country_of_origin !== undefined) {
      mainAuthor.country_of_origin = country_of_origin;
    }
    await mainAuthor.save();

    return mainAuthor;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al actualizar el MainAuthor: ${error.message}`);
  }
};

// Eliminar un MainAuthor por ID
const deleteMainAuthor = async (id) => {
  try {
    const mainAuthor = await MainAuthor.findByPk(id);

    if (!mainAuthor) {
      throw new Error('MainAuthor no encontrado');
    }

    await mainAuthor.destroy();
    return { message: 'MainAuthor eliminado exitosamente' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al eliminar el MainAuthor: ${error.message}`);
  }
};

// Obtener todos los libros asociados a un MainAuthor por ID
const getBooksByMainAuthorId = async (id) => {
  try {
    const mainAuthor = await MainAuthor.findByPk(id);

    if (!mainAuthor) {
      throw new Error('MainAuthor no encontrado');
    }

    const books = await mainAuthor.getBooks();
    return books;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los libros del MainAuthor: ${error.message}`);
  }
};

const associateBookWithAuthor = async (bookId, mainAuthorId) => {
  try {
    const mainAuthor = await MainAuthor.findByPk(mainAuthorId);
    if (!mainAuthor) {
      throw new Error('MainAuthor no encontrado');
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      throw new Error('Book no encontrado');
    }

    await mainAuthor.addBook(book);
    return { message: `Libro con ID ${bookId} asociado correctamente al autor con ID ${mainAuthorId}` };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al asociar el libro con el autor: ${error.message}`);
  }
};

module.exports = {
  createMainAuthor,
  getAllMainAuthors,
  getMainAuthorById,
  updateMainAuthor,
  deleteMainAuthor,
  getBooksByMainAuthorId,
  associateBookWithAuthor,
};
