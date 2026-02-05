const express = require('express');
const router = express.Router();
const logger = require('../logger/logger');
const { createKeyWord, getAllKeyWords, getKeyWordById, updateKeyWord, deleteKeyWord, associateBookWithKeyWord, getBooksByKeyWord, getKeyWordByName } = require("../controllers/key_word_controller");

/**
 * @swagger
 * /api/key_words/create:
 *   post:
 *     summary: Create a new key word
 *     tags: [KeyWords]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KeyWord'
 *     responses:
 *       201:
 *         description: KeyWord created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/KeyWord'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/create', async (req, res) => {
  try {
    const result = await createKeyWord(req.body);
    res.status(201).json({
      message: 'KeyWord creado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('key_word_name es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al crear el KeyWord', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/key_words:
 *   get:
 *     summary: Get all key words
 *     tags: [KeyWords]
 *     responses:
 *       200:
 *         description: List of key words
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KeyWord'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const result = await getAllKeyWords();
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los KeyWords', error: error.message });
  }
});

/**
 * @swagger
 * /api/key_words/{id}:
 *   get:
 *     summary: Get a key word by ID
 *     tags: [KeyWords]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: KeyWord ID
 *     responses:
 *       200:
 *         description: KeyWord data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeyWord'
 *       404:
 *         description: KeyWord not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await getKeyWordById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('KeyWord no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener el KeyWord', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/key_words/name/{key_word_name}:
 *   get:
 *     summary: Get a key word by name
 *     tags: [KeyWords]
 *     parameters:
 *       - in: path
 *         name: key_word_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Key word name
 *     responses:
 *       200:
 *         description: KeyWord data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeyWord'
 *       404:
 *         description: KeyWord not found
 *       500:
 *         description: Internal server error
 */
router.get('/name/:key_word_name', async (req, res) => {
  try {
    const result = await getKeyWordByName(req.params.key_word_name);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('KeyWord no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener el KeyWord por nombre', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/key_words/update/{id}:
 *   put:
 *     summary: Update a key word by ID
 *     tags: [KeyWords]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: KeyWord ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KeyWord'
 *     responses:
 *       200:
 *         description: KeyWord updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/KeyWord'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/update/:id', async (req, res) => {
  try {
    const result = await updateKeyWord(req.params.id, req.body);
    res.status(200).json({
      message: 'KeyWord actualizado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('KeyWord no encontrado') ||
        error.message.includes('key_word_name es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al actualizar el KeyWord', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/key_words/delete/{id}:
 *   delete:
 *     summary: Delete a key word by ID
 *     tags: [KeyWords]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: KeyWord ID
 *     responses:
 *       200:
 *         description: KeyWord deleted successfully
 *       404:
 *         description: KeyWord not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await deleteKeyWord(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('KeyWord no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al eliminar el KeyWord', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/key_words/associate/{book_id}/{keyword_id}:
 *   post:
 *     summary: Associate a book with a key word
 *     tags: [KeyWords]
 *     parameters:
 *       - in: path
 *         name: book_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *       - in: path
 *         name: keyword_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: KeyWord ID
 *     responses:
 *       200:
 *         description: Association created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Book or KeyWord not found
 *       500:
 *         description: Internal server error
 */
router.post('/associate/:book_id/:keyword_id', async (req, res) => {
  try {
    const result = await associateBookWithKeyWord(req.params.book_id, req.params.keyword_id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Libro no encontrado') || error.message.includes('Palabra clave no encontrada')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al asociar el libro con la palabra clave', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/key_words/books/{key_word_name}:
 *   get:
 *     summary: Get books by key word name
 *     tags: [KeyWords]
 *     parameters:
 *       - in: path
 *         name: key_word_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Key word name
 *     responses:
 *       200:
 *         description: List of books associated with the key word
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       404:
 *         description: Key word not found
 *       500:
 *         description: Internal server error
 */
router.get('/books/:key_word_name', async (req, res) => {
  try {
    const result = await getBooksByKeyWord(req.params.key_word_name);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Palabra clave no encontrada')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener los libros de la palabra clave', error: error.message });
    }
  }
});

module.exports = router;
