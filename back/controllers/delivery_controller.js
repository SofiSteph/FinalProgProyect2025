const Delivery = require('../models/delivery');
const Loan = require('../models/loan');
const User = require('../models/user');
const Book = require('../models/book');
const { getRandomDealer } = require('./user_controller');


// Crear un Delivery
const createDelivery = async ({ status, dealer_user_id }) => {
  try {
    if (!status) {
      throw new Error('status es requerido');
    }

    if (!dealer_user_id) {
      throw new Error('dealer_user_id es requerido');
    }

    const nuevoDelivery = await Delivery.create({ status, dealer_user_id });
    return nuevoDelivery;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al crear el Delivery: ${error.message}`);
  }
};

// Obtener todos los Deliveries
const getAllDeliveries = async () => {
  try {
    const deliveries = await Delivery.findAll({
      include: [
        { model: User },
        { model: Loan , include: [
            { model: Book } 
        ]}
      ]
    });
    return deliveries;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los Deliveries: ${error.message}`);
  }
};

// Obtener un Delivery por ID
const getDeliveryById = async (id) => {
  try {
    const delivery = await Delivery.findByPk(id, {
      include: [
        { model: User },
        { model: Loan }
      ]
    });

    if (!delivery) {
      throw new Error('Delivery no encontrado');
    }

    return delivery;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el Delivery: ${error.message}`);
  }
};

// Actualizar un Delivery por ID
const updateDelivery = async (id, { status, dealer_user_id }) => {
  try {
    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      throw new Error('Delivery no encontrado');
    }

    if (!status) {
      throw new Error('status es requerido');
    }

    if (!dealer_user_id) {
      throw new Error('dealer_user_id es requerido');
    }

    delivery.status = status;
    delivery.dealer_user_id = dealer_user_id;
    await delivery.save();

    return delivery;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al actualizar el Delivery: ${error.message}`);
  }
};

// Eliminar un Delivery por ID
const deleteDelivery = async (id) => {
  try {
    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      throw new Error('Delivery no encontrado');
    }

    await delivery.destroy();
    return { message: 'Delivery eliminado exitosamente' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al eliminar el Delivery: ${error.message}`);
  }
};

// Obtener los préstamos asociados a un Delivery por ID
const getLoansByDeliveryId = async (deliveryId) => {
  try {
    if (!deliveryId) {
      throw new Error('deliveryId es requerido');
    }

    const loans = await Loan.findAll({
      where: { delivery_id: deliveryId },
      include: [
        { model: User, as: 'reader' }, // assuming alias for reader_user_id
        { model: User, as: 'technician' }, // assuming alias for room_technician_user_id
        { model: Book }
      ]
    });

    return loans;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los préstamos del Delivery: ${error.message}`);
  }
};

// Obtener los deliveries asociados a un usuario por id
const getDeliveriesByUserId = async (userId) => {
  try {
    if (!userId) {
      throw new Error('userId es requerido');
    }

    const user = await User.findByPk(userId, {
      include: [{ model: require('../models/role') }]
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    let deliveries;

    if (user.role.role === 'dealer') {
      deliveries = await Delivery.findAll({
        where: { dealer_user_id: userId },
        include: [
          { model: User },
          { model: Loan, include: [
            { model: User, as: 'reader' },
            { model: User, as: 'technician' },
            { model: Book }
          ] }
        ]
      });
    } else if (user.role.role === 'reader') {
      deliveries = await Delivery.findAll({
        include: [
          { model: User },
          { model: Loan, where: { reader_user_id: userId }, required: true, include: [
            { model: User, as: 'reader' },
            { model: User, as: 'technician' },
            { model: Book }
          ] }
        ]
      });
    } else {
      throw new Error('Rol de usuario no válido');
    }

    return deliveries;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los Deliveries: ${error.message}`);
  }
};

// Buscar si el usuario tiene alguna entrega en estado "Pendiente".
const addLoanToDelivery = async (userId) => {
  try {
    if (!userId) {
      throw new Error('userId es requerido');
    }

    // Buscar entregas pendientes del usuario
    const pendingDeliveries = await Delivery.findAll({
      where: { status: 'pendiente' },
      include: [
        {
          model: Loan,
          where: { reader_user_id: userId },
          required: false
        }
      ]
    });

    // Filtrar entregas que tienen menos de 3 préstamos
    const availableDeliveries = pendingDeliveries.filter(delivery => delivery.loans.length < 3);

    if (availableDeliveries.length === 0) {
      // Crear un nuevo delivery si no hay disponibles
      const dealerUserId = await getRandomDealer();
      const newDelivery = await createDelivery({ status: 'pendiente', dealer_user_id: dealerUserId });
      return newDelivery.id;
    }

    // Tomar la primera entrega disponible
    const targetDelivery = availableDeliveries[0];

    // Devolver el id de la entrega disponible
    return targetDelivery.id;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener la entrega disponible: ${error.message}`);
  }
};

module.exports = {
  createDelivery,
  updateDelivery,
  getAllDeliveries,
  getDeliveryById,
  getLoansByDeliveryId,
  getDeliveriesByUserId,
  deleteDelivery,
  addLoanToDelivery
};
