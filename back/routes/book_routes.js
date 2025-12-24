const express = require('express');
const router = express.Router();
const { createBook, getAllBooks, getBookById, toLoan, updateBook, deleteBook } = require("../controllers/book_controller");
const upload = require('../middlewares/multerConfig');
const logger = require('../logger/logger');
const authenticate = require("../middlewares/authMiddleware")
/**
 * @swagger
 * /api/books/create:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - book_name
 *               - year_written
 *               - available_copies
 *               - book_room_id
 *               - main_author
 *               - key_word
 *             properties:
 *               book_name:
 *                 type: string
 *               year_written:
 *                 type: integer
 *               available_copies:
 *                 type: integer
 *               book_room_id:
 *                 type: integer
 *               main_author:
 *                 type: object
 *                 properties:
 *                   author_name:
 *                     type: string
 *                   country_of_origin:
 *                     type: string
 *               key_word:
 *                 type: object
 *                 properties:
 *                   key_word_name:
 *                     type: string
 *               productImage: 
 *                 type: file
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/create', upload.single('productImage'), async (req, res) => {
  try {
    const body = await req.body;

    // Parsear números
    if (body.year_written) body.year_written = parseInt(body.year_written, 10);
    if (body.available_copies) body.available_copies = parseInt(body.available_copies, 10);
    if (body.book_room_id) body.book_room_id = parseInt(body.book_room_id, 10);

    // Parsear main_author y key_word si vienen como JSON string
    if (typeof body.main_author === 'string') {
      try { body.main_author = JSON.parse(body.main_author); } catch (_) { /* mantener string */ }
    }
    if (typeof body.key_word === 'string') {
      try { body.key_word = JSON.parse(body.key_word); } catch (_) { /* mantener string */ }
    }

    // Si Swagger envía campos con corchetes (main_author[author_name]), convertirlos:
    if (!body.main_author) {
      const ma = {};
      if (body['main_author[author_name]']) ma.author_name = body['main_author[author_name]'];
      if (body['main_author[country_of_origin]']) ma.country_of_origin = body['main_author[country_of_origin]'];
      if (Object.keys(ma).length) body.main_author = ma;
    }
    if (!body.key_word) {
      const kw = {};
      if (body['key_word[key_word_name]']) kw.key_word_name = body['key_word[key_word_name]'];
      if (Object.keys(kw).length) body.key_word = kw;
    }

    // Añadir ruta de la imagen
    body.image = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const result = await createBook(body);
    res.status(201).json({
      message: 'Book creado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (
      error.message.includes('book_name es requerido') ||
      error.message.includes('year_written es requerido') ||
      error.message.includes('available_copies debe ser mayor o igual a 0') ||
      error.message.includes('book_room_id es requerido') ||
      error.message.includes('main_author es requerido') ||
      error.message.includes('key_word es requerido')
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al crear el Book', error: error.message });
    }
  }
});


/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate(["reader"]), async (req, res) => {
  try {
    const result = await getAllBooks();
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los Books', error: error.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await getBookById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Book no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener el Book', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/books/update/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_name:
 *                 type: string
 *               year_written:
 *                 type: integer
 *               available_copies:
 *                 type: integer
 *               main_author:
 *                 type: object
 *                 properties:
 *                   author_name:
 *                     type: string
 *                   country_of_origin:
 *                     type: string
 *               key_word:
 *                 type: object
 *                 properties:
 *                   key_word_name:
 *                     type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/update/:id', async (req, res) => {
  try {
    const result = await updateBook(req.params.id, req.body);
    res.status(200).json({
      message: 'Book actualizado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Book no encontrado') ||
        error.message.includes('book_name es requerido') ||
        error.message.includes('year_written es requerido') ||
        error.message.includes('available_copies debe ser mayor o igual a 0')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al actualizar el Book', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/books/loan/{id}:
 *   post:
 *     summary: Loan a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loan_start_date
 *               - loan_end_date
 *               - reader_user_id
 *               - room_technician_user_id
 *               - delivery_id
 *             properties:
 *               loan_start_date:
 *                 type: string
 *                 format: date
 *               loan_end_date:
 *                 type: string
 *                 format: date
 *               reader_user_id:
 *                 type: integer
 *               room_technician_user_id:
 *                 type: integer
 *               delivery_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Loan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.post('/loan/:id', async (req, res) => {
  try {
    const result = await toLoan(req.params.id, req.body);
    res.status(201).json({
      message: 'Préstamo creado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Book no encontrado') ||
        error.message.includes('No hay copias disponibles para prestar') ||
        error.message.includes('loan_start_date es requerido') ||
        error.message.includes('loan_end_date es requerido') ||
        error.message.includes('reader_user_id es requerido') ||
        error.message.includes('room_technician_user_id es requerido') ||
        error.message.includes('delivery_id es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al prestar el Book', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/books/delete/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await deleteBook(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Book no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al eliminar el Book', error: error.message });
    }
  }
});

module.exports = router;
