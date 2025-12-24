const BookRoom = require('../models/book_room');
const Book = require('../models/book');
const User = require('../models/user');
const Role = require('../models/role');

// Crear un BookRoom
const createBookRoom = async ({ room_name }) => {
  try {
    if (!room_name) {
      throw new Error('room_name es requerido');
    }

    const nuevoBookRoom = await BookRoom.create({ room_name });
    return nuevoBookRoom;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al crear el BookRoom: ${error.message}`);
  }
};

// Obtener todos los BookRooms
const getAllBookRooms = async (query = {}) => {
  try {
    const bookRooms = await BookRoom.findAll({ where: query });
    return bookRooms;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los BookRooms: ${error.message}`);
  }
};

// Obtener un BookRoom por ID
const getBookRoomById = async (id) => {
  try {
    const bookRoom = await BookRoom.findByPk(id);

    if (!bookRoom) {
      throw new Error('BookRoom no encontrado');
    }

    return bookRoom;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el BookRoom: ${error.message}`);
  }
};

// Actualizar un BookRoom por ID
const updateBookRoom = async (id, { room_name }) => {
  try {
    const bookRoom = await BookRoom.findByPk(id);
    if (!bookRoom) {
      throw new Error('BookRoom no encontrado');
    }
    if (!room_name) {
      throw new Error('room_name es requerido');
    }

    bookRoom.room_name = room_name;
    await bookRoom.save();
    return bookRoom;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al actualizar el BookRoom: ${error.message}`);
  }
};

// Eliminar un BookRoom por ID
const deleteBookRoom = async (id) => {
  try {
    const bookRoom = await BookRoom.findByPk(id);

    if (!bookRoom) {
      throw new Error('BookRoom no encontrado');
    }

    await bookRoom.destroy();
    return { message: 'BookRoom eliminado exitosamente' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al eliminar el BookRoom: ${error.message}`);
  }
};

// Obtener todos los libros de una sala por ID
const getBooksByRoomId = async (id) => {
  try {
    const books = await Book.findAll({ where: { book_room_id: id }, include: [{ model: BookRoom }] });
    return books;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los libros de la sala: ${error.message}`);
  }
};

// Obtener la lista de técnicos de una sala por ID
const getTechniciansByRoomId = async (id) => {
  try {
    const technicianRole = await Role.findOne({ where: { role: 'technician' } });
    if (!technicianRole) {
      throw new Error('Rol Technician no encontrado');
    }
    const technicians = await User.findAll({
      where: { book_room_id: id, role_id: technicianRole.id },
      include: [{ model: BookRoom }, { model: Role }]
    });
    return technicians;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los técnicos de la sala: ${error.message}`);
  }
};

// Verificar si un BookRoom existe por room_name
const checkBookRoomExists = async (room_name) => {
  try {
    if (!room_name) {
      throw new Error('room_name es requerido');
    }

    const existingBookRoom = await BookRoom.findOne({ where: { room_name } });
    return existingBookRoom;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al verificar el BookRoom: ${error.message}`);
  }
};

module.exports = {
  createBookRoom,
  getAllBookRooms,
  getBookRoomById,
  updateBookRoom,
  deleteBookRoom,
  getBooksByRoomId,
  getTechniciansByRoomId,
  checkBookRoomExists,
};
