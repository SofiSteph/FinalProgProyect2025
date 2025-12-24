const Loan = require('../models/loan');
const User = require('../models/user');
const Book = require('../models/book');
const Delivery = require('../models/delivery');

// Crear un Loan
const createLoan = async ({ loan_start_date, loan_end_date, validated, reader_user_id, room_technician_user_id, book_id, delivery_id }) => {
  try {
    if (!loan_start_date) {
      throw new Error('loan_start_date es requerido');
    }

    if (!loan_end_date) {
      throw new Error('loan_end_date es requerido');
    }

    if (!reader_user_id) {
      throw new Error('reader_user_id es requerido');
    }

    if (!room_technician_user_id) {
      throw new Error('room_technician_user_id es requerido');
    }

    if (!book_id) {
      throw new Error('book_id es requerido');
    }

    const nuevoLoan = await Loan.create({ loan_start_date, loan_end_date, validated, reader_user_id, room_technician_user_id, book_id, delivery_id });
    return nuevoLoan;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al crear el Loan: ${error.message}`);
  }
};

// Obtener todos los Loans
const getAllLoans = async () => {
  try {
    const loans = await Loan.findAll({
      include: [
        { model: User, as: 'reader' },      // lector
        { model: User, as: 'technician' },  // técnico
        { model: Book },
        { model: Delivery }
      ]
    });
    return loans;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los Loans: ${error.message}`);
  }
};

// Obtener un Loan por ID
const getLoanById = async (id) => {
  try {
    const loan = await Loan.findByPk(id, {
      include: [
        { model: User, as: 'reader' },      // lector
        { model: User, as: 'technician' },  // técnico
        { model: Book },
        { model: Delivery }
      ]
    });

    if (!loan) {
      throw new Error('Loan no encontrado');
    }

    return loan;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el Loan: ${error.message}`);
  }
};

// Actualizar un Loan por ID
const updateLoan = async (id, { loan_start_date, loan_end_date, validated, reader_user_id, room_technician_user_id, book_id, delivery_id }) => {
  try {
    const loan = await Loan.findByPk(id);

    if (!loan) {
      throw new Error('Loan no encontrado');
    }

    if (!loan_start_date) {
      throw new Error('loan_start_date es requerido');
    }

    if (!loan_end_date) {
      throw new Error('loan_end_date es requerido');
    }

    if (!reader_user_id) {
      throw new Error('reader_user_id es requerido');
    }

    if (!room_technician_user_id) {
      throw new Error('room_technician_user_id es requerido');
    }

    if (!book_id) {
      throw new Error('book_id es requerido');
    }

    if (!delivery_id) {
      throw new Error('delivery_id es requerido');
    }

    loan.loan_start_date = loan_start_date;
    loan.loan_end_date = loan_end_date;
    if (validated !== undefined) {
      loan.validated = validated;
    }
    loan.reader_user_id = reader_user_id;
    loan.room_technician_user_id = room_technician_user_id;
    loan.book_id = book_id;
    loan.delivery_id = delivery_id;
    await loan.save();

    return loan;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al actualizar el Loan: ${error.message}`);
  }
};


// Validar un Loan por ID
const validateLoan = async (id) => {
  try {
    const loan = await Loan.findByPk(id);

    if (!loan) {
      throw new Error('Loan no encontrado');
    }

    loan.validated = true;
    await loan.save();

    return { message: 'Préstamo validado exitosamente' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al validar el Loan: ${error.message}`);
  }
};

// Eliminar un Loan por ID
const deleteLoan = async (id) => {
  try {
    const loan = await Loan.findByPk(id);

    if (!loan) {
      throw new Error('Loan no encontrado');
    }

    await loan.destroy();
    return { message: 'Loan eliminado exitosamente' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al eliminar el Loan: ${error.message}`);
  }
};

// Obtener Loans por ID del Técnico (room_technician_user_id) con validated = false
const getLoansByIdTechnician = async (id) => {
  try {
    const loans = await Loan.findAll({
      where: {
        room_technician_user_id: id,
        validated: false
      },
      include: [
        { model: User, as: 'reader' },      // lector
        { model: User, as: 'technician' },  // técnico
        { model: Book },
        { model: Delivery }
      ]
    });
    return loans;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los Loans por técnico: ${error.message}`);
  }
};

module.exports = {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  validateLoan,
  deleteLoan,
  getLoansByIdTechnician,
};
