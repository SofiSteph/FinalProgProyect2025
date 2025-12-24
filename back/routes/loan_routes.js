const express = require('express');
const router = express.Router();
const logger = require('../logger/logger');
const { createLoan, getAllLoans, getLoanById, updateLoan, validateLoan, deleteLoan, getLoansByIdTechnician} = require("../controllers/loan_controller");
const authenticate = require("../middlewares/authMiddleware")

/**
 * @swagger
 * /api/loans/create:
 *   post:
 *     summary: Create a new loan
 *     tags: [Loans]
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
 *               - book_id
 *               - delivery_id
 *             properties:
 *               loan_start_date:
 *                 type: string
 *                 format: date
 *               loan_end_date:
 *                 type: string
 *                 format: date
 *               validated:
 *                 type: boolean
 *               reader_user_id:
 *                 type: integer
 *               room_technician_user_id:
 *                 type: integer
 *               book_id:
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
 *       500:
 *         description: Internal server error
 */
router.post('/create',  authenticate(["technician"]), async (req, res) => {
  try {
    const result = await createLoan(req.body);
    res.status(201).json({
      message: 'Loan creado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('loan_start_date es requerido') ||
        error.message.includes('loan_end_date es requerido') ||
        error.message.includes('reader_user_id es requerido') ||
        error.message.includes('room_technician_user_id es requerido') ||
        error.message.includes('book_id es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al crear el Loan', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loans
 *     tags: [Loans]
 *     responses:
 *       200:
 *         description: List of loans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const result = await getAllLoans();
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los Loans', error: error.message });
  }
});

/**
 * @swagger
 * /api/loans/{id}:
 *   get:
 *     summary: Get a loan by ID
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Loan data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await getLoanById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Loan no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener el Loan', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/loans/update/{id}:
 *   put:
 *     summary: Update a loan by ID
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan ID
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
 *               - book_id
 *               - delivery_id
 *             properties:
 *               loan_start_date:
 *                 type: string
 *                 format: date
 *               loan_end_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: boolean
 *               validated:
 *                 type: boolean
 *               reader_user_id:
 *                 type: integer
 *               room_technician_user_id:
 *                 type: integer
 *               book_id:
 *                 type: integer
 *               delivery_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Loan updated successfully
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
 *       500:
 *         description: Internal server error
 */
router.put('/update/:id', async (req, res) => {
  try {
    const result = await updateLoan(req.params.id, req.body);
    res.status(200).json({
      message: 'Loan actualizado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Loan no encontrado') ||
        error.message.includes('loan_start_date es requerido') ||
        error.message.includes('loan_end_date es requerido') ||
        error.message.includes('reader_user_id es requerido') ||
        error.message.includes('room_technician_user_id es requerido') ||
        error.message.includes('book_id es requerido') ||
        error.message.includes('delivery_id es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al actualizar el Loan', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/loans/validate/{id}:
 *   put:
 *     summary: Validate a loan by ID
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Loan validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.put('/validate/:id',  authenticate(["technician"]), async (req, res) => {
  try {
    const result = await validateLoan(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Loan no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al validar el Loan', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/loans/delete/{id}:
 *   delete:
 *     summary: Delete a loan by ID
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Loan deleted successfully
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id',  authenticate(["technician"]), async (req, res) => {
  try {
    const result = await deleteLoan(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Loan no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al eliminar el Loan', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/loans/technician/{id}:
 *   get:
 *     summary: Get loans by technician ID with validated = false
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Technician User ID
 *     responses:
 *       200:
 *         description: List of loans for the technician
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 *       500:
 *         description: Internal server error
 */
router.get('/technician/:id', async (req, res) => {
  try {
    const result = await getLoansByIdTechnician(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los Loans por técnico', error: error.message });
  }
});

module.exports = router;
