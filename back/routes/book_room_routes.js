const express = require('express');
const router = express.Router();
const logger = require('../logger/logger');
const { createBookRoom, getAllBookRooms, getBookRoomById, updateBookRoom, deleteBookRoom, getBooksByRoomId, getTechniciansByRoomId, checkBookRoomExists } = require("../controllers/book_room_controller");
/**
 * @swagger
 * /api/book_rooms/create:
 *   post:
 *     summary: Create a new book room
 *     tags: [BookRooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookRoom'
 *     responses:
 *       201:
 *         description: BookRoom created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BookRoom'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/create', async (req, res) => {
  try {
    const result = await createBookRoom(req.body);
    res.status(201).json({
      message: 'BookRoom creado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('room_name es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al crear el BookRoom', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/book_rooms:
 *   get:
 *     summary: Get all book rooms
 *     tags: [BookRooms]
 *     responses:
 *       200:
 *         description: List of book rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookRoom'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const query = req.query;
    const result = await getAllBookRooms(query);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los BookRooms', error: error.message });
  }
});

/**
 * @swagger
 * /api/book_rooms/{id}:
 *   get:
 *     summary: Get a book room by ID
 *     tags: [BookRooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: BookRoom ID
 *     responses:
 *       200:
 *         description: BookRoom data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookRoom'
 *       404:
 *         description: BookRoom not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await getBookRoomById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('BookRoom no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener el BookRoom', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/book_rooms/update/{id}:
 *   put:
 *     summary: Update a book room by ID
 *     tags: [BookRooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: BookRoom ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookRoom'
 *     responses:
 *       200:
 *         description: BookRoom updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BookRoom'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/update/:id', async (req, res) => {
  try {
    const result = await updateBookRoom(req.params.id, req.body);
    res.status(200).json({
      message: 'BookRoom actualizado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('BookRoom no encontrado') || error.message.includes('room_name es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al actualizar el BookRoom', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/book_rooms/delete/{id}:
 *   delete:
 *     summary: Delete a book room by ID
 *     tags: [BookRooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: BookRoom ID
 *     responses:
 *       200:
 *         description: BookRoom deleted successfully
 *       404:
 *         description: BookRoom not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await deleteBookRoom(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('BookRoom no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al eliminar el BookRoom', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/book_rooms/books/{id}:
 *   get:
 *     summary: Get all books of a book room by room ID
 *     tags: [BookRooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: BookRoom ID
 *     responses:
 *       200:
 *         description: List of books in the book room
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */
router.get('/books/:id', async (req, res) => {
  try {
    const result = await getBooksByRoomId(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los libros de la sala', error: error.message });
  }
});

/**
 * @swagger
 * /api/book_rooms/technicians/{id}:
 *   get:
 *     summary: Get all technicians of a book room by room ID
 *     tags: [BookRooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: BookRoom ID
 *     responses:
 *       200:
 *         description: List of technicians in the book room
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get('/technicians/:id', async (req, res) => {
  try {
    const result = await getTechniciansByRoomId(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los técnicos de la sala', error: error.message });
  }
});

/**
 * @swagger
 * /api/book_rooms/exists/{room_name}:
 *   get:
 *     summary: Check if a book room exists by room name
 *     tags: [BookRooms]
 *     parameters:
 *       - in: path
 *         name: room_name
 *         required: true
 *         schema:
 *           type: string
 *         description: BookRoom name
 *     responses:
 *       200:
 *         description: BookRoom data if exists, null if not
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookRoom'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/exists/:room_name', async (req, res) => {
  try {
    const result = await checkBookRoomExists(req.params.room_name);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('room_name es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al verificar el BookRoom', error: error.message });
    }
  }
});

module.exports = router;
