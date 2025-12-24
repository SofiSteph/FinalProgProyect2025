const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, getUserByUsername, assignRoleToUser, getRandomDealer } = require("../controllers/user_controller");
const logger = require('../logger/logger');

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/create', async (req, res) => {
  try {
    const result = await createUser(req.body);
    res.status(201).json({
      message: 'User creado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('name es requerido') ||
        error.message.includes('password es requerido') ||
        error.message.includes('email es requerido') ||
        error.message.includes('username es requerido') ||
        error.message.includes('role_id es requerido')) {
        res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al crear el User', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const result = await getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Error al obtener los Users', error: error.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await getUserById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('User no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener el User', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/users/update/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/update/:id', async (req, res) => {
  try {
    const result = await updateUser(req.params.id, req.body);
    res.status(200).json({
      message: 'User actualizado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('User no encontrado') ||
        error.message.includes('name es requerido') ||
        error.message.includes('password es requerido') ||
        error.message.includes('email es requerido') ||
        error.message.includes('username es requerido')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al actualizar el User', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('User no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al eliminar el User', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/users/username/{username}:
 *   get:
 *     summary: Get a user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/username/:username', async (req, res) => {
  try {
    const result = await getUserByUsername(req.params.username);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('User no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener el User', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/users/assign/{userId}/{roleId}:
 *   post:
 *     summary: Assign a role to a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User or Role not found
 *       500:
 *         description: Internal server error
 */
router.post('/assign/:userId/:roleId', async (req, res) => {
  try {
    const result = await assignRoleToUser(req.params.userId, req.params.roleId);
    res.status(200).json({
      message: 'Rol asignado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('User no encontrado') || error.message.includes('Role no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al asignar rol al usuario', error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/users/random-dealer:
 *   get:
 *     summary: Get a random dealer user ID
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Random dealer user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dealerId:
 *                   type: integer
 *       404:
 *         description: No dealers available
 *       500:
 *         description: Internal server error
 */
router.get('/random-dealer', async (req, res) => {
  try {
    const result = await getRandomDealer();
    res.status(200).json({ dealerId: result });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes('No hay dealers disponibles')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al obtener un dealer aleatorio', error: error.message });
    }
  }
});

module.exports = router;
