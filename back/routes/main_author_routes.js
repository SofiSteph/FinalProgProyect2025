const express = require('express');
const router = express.Router();
const logger = require('../logger/logger');
const { createMainAuthor, getAllMainAuthors, getMainAuthorById, updateMainAuthor, deleteMainAuthor, getBooksByMainAuthorId, getMainAuthorByName, associateBookWithAuthor } = require("../controllers/main_author_controller");

/**
 * @swagger
 * /api/main_authors/create:
 *   post:
 *     summary: Create a new main author
 *     tags: [MainAuthors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author_name
 *             properties:
 *               author_name:
 *                 type: string
 *               country_of_origin:
 *                 type: string
 *     responses:
 *       201:
 *         description: MainAuthor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MainAuthor'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/create', async (req, res) => {
  try {
    const result = await createMainAuthor(req.body);
    res.status(201).json({
      message: 'MainAuthor creado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('author_name es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al crear el MainAuthor', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/main_authors/books/{id}:
 *   get:
 *     summary: Get books by main author ID
 *     tags: [MainAuthors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: MainAuthor ID
 *     responses:
 *       200:
 *         description: List of books by the main author
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       404:
 *         description: MainAuthor not found
 *       500:
 *         description: Internal server error
 */
router.get('/books/:id', async (req, res) => {
  try {
    const result = await getBooksByMainAuthorId(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('MainAuthor no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener los libros del MainAuthor', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/main_authors:
 *   get:
 *     summary: Get all main authors
 *     tags: [MainAuthors]
 *     responses:
 *       200:
 *         description: List of main authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MainAuthor'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const result = await getAllMainAuthors();
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los MainAuthors', error: error.message });
  }
});

/**
 * @swagger
 * /api/main_authors/{id}:
 *   get:
 *     summary: Get a main author by ID
 *     tags: [MainAuthors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: MainAuthor ID
 *     responses:
 *       200:
 *         description: MainAuthor data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MainAuthor'
 *       404:
 *         description: MainAuthor not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await getMainAuthorById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('MainAuthor no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener el MainAuthor', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/main_authors/update/{id}:
 *   put:
 *     summary: Update a main author by ID
 *     tags: [MainAuthors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: MainAuthor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author_name
 *             properties:
 *               author_name:
 *                 type: string
 *               country_of_origin:
 *                 type: string
 *     responses:
 *       200:
 *         description: MainAuthor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MainAuthor'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/update/:id', async (req, res) => {
  try {
    const result = await updateMainAuthor(req.params.id, req.body);
    res.status(200).json({
      message: 'MainAuthor actualizado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('MainAuthor no encontrado') ||
        error.message.includes('author_name es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al actualizar el MainAuthor', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/main_authors/delete/{id}:
 *   delete:
 *     summary: Delete a main author by ID
 *     tags: [MainAuthors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: MainAuthor ID
 *     responses:
 *       200:
 *         description: MainAuthor deleted successfully
 *       404:
 *         description: MainAuthor not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await deleteMainAuthor(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('MainAuthor no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al eliminar el MainAuthor', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/main_authors/by-name/{author_name}:
 *   get:
 *     summary: Get a main author by name
 *     tags: [MainAuthors]
 *     parameters:
 *       - in: path
 *         name: author_name
 *         required: true
 *         schema:
 *           type: string
 *         description: MainAuthor name
 *     responses:
 *       200:
 *         description: MainAuthor data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MainAuthor'
 *       500:
 *         description: Internal server error
 */
router.get('/by-name/:author_name', async (req, res) => {
  try {
    const result = await getMainAuthorByName(req.params.author_name);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener el MainAuthor por nombre', error: error.message });
  }
});

/**
 * @swagger
 * /api/main_authors/associate:
 *   post:
 *     summary: Associate a book with a main author
 *     tags: [MainAuthors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - mainAuthorId
 *             properties:
 *               bookId:
 *                 type: integer
 *               mainAuthorId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Association successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: MainAuthor or Book not found
 *       500:
 *         description: Internal server error
 */
router.post('/associate', async (req, res) => {
  try {
    const { bookId, mainAuthorId } = req.body;
    const result = await associateBookWithAuthor(bookId, mainAuthorId);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('MainAuthor no encontrado') || error.message.includes('Book no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al asociar el libro con el autor', error: error.message });
    }
  }
});

module.exports = router;
