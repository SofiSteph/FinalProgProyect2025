const express = require('express');
const router = express.Router();
const logger = require('../logger/logger');
const { createDelivery, getAllDeliveries, getDeliveryById, updateDelivery, deleteDelivery, getLoansByDeliveryId, getDeliveriesByUserId, addLoanToDelivery } = require("../controllers/delivery_controller");
const authenticate = require("../middlewares/authMiddleware")

/**
 * @swagger
 * /api/deliveries/create:
 *   post:    
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/create', async (req, res) => {
  try {
    const result = await createDelivery(req.body);
    res.status(201).json({
      message: 'Delivery creado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('status es requerido') ||
        error.message.includes('dealer_user_id es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al crear el Delivery', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Get all deliveries
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: List of deliveries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const result = await getAllDeliveries();
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los Deliveries', error: error.message });
  }
});

/**
 * @swagger
 * /api/deliveries/{id}:
 *   get:
 *     summary: Get a delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await getDeliveryById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Delivery no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener el Delivery', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/deliveries/update/{id}:
 *   put:
 *     summary: Update a delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       200:
 *         description: Delivery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/update/:id', async (req, res) => {
  try {
    const result = await updateDelivery(req.params.id, req.body);
    res.status(200).json({
      message: 'Delivery actualizado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Delivery no encontrado') ||
        error.message.includes('status es requerido') ||
        error.message.includes('dealer_user_id es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al actualizar el Delivery', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/deliveries/delete/{id}:
 *   delete:
 *     summary: Delete a delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery deleted successfully
 *       404:
 *         description: Delivery not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id', authenticate(["reader"]), async (req, res) => {
  try {
    const result = await deleteDelivery(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Delivery no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al eliminar el Delivery', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/deliveries/loans/{id}:
 *   get:
 *     summary: Get loans by delivery ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: List of loans for the delivery
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 *       500:
 *         description: Internal server error
 */
router.get('/loans/:id', authenticate(["reader", "dealer"]), async (req, res) => {
  try {
    const result = await getLoansByDeliveryId(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los préstamos del delivery', error: error.message });
  }
});

/**
 * @swagger
 * /api/deliveries/user/{userId}:
 *   get:
 *     summary: Get deliveries by user ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of deliveries for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', authenticate(["reader"]), async (req, res) => {
  try {
    const result = await getDeliveriesByUserId(req.params.userId);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('Usuario no encontrado') ||
        error.message.includes('Rol de usuario no válido')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener los deliveries del usuario', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/deliveries/add-loan/{userId}:
 *   post:
 *     summary: Get available delivery ID for a user to add a new loan
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Available delivery ID or false if none
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deliveryId:
 *                   type: integer
 *                   nullable: true
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/add-loan/:userId', authenticate(["technician"]), async (req, res) => {
  try {
    const result = await addLoanToDelivery(req.params.userId);
    res.status(200).json({ deliveryId: result });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('userId es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener la entrega disponible', error: error.message });
    }
  }
});

module.exports = router;
