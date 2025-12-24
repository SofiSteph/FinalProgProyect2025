const Role = require('../models/role');
const User = require('../models/user');

// Crear un Role
const createRole = async ({ role }) => {
  try {
    if (!role) {
      throw new Error('role es requerido');
    }

    const nuevoRole = await Role.create({ role });
    return nuevoRole;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al crear el Role: ${error.message}`);
  }
};

// Obtener todos los Roles
const getAllRoles = async (query = {}) => {
  try {
    const roles = await Role.findAll({ where: query });
    return roles;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los Roles: ${error.message}`);
  }
};

// Obtener un Role por ID
const getRoleById = async (id) => {
  try {
    const role = await Role.findByPk(id);

    if (!role) {
      throw new Error('Role no encontrado');
    }

    return role;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el Role: ${error.message}`);
  }
};

// Actualizar un Role por ID
const updateRole = async (id, { role }) => {
  try {
    const roleInstance = await Role.findByPk(id);

    if (!roleInstance) {
      throw new Error('Role no encontrado');
    }

    if (!role) {
      throw new Error('role es requerido');
    }

    roleInstance.role = role;
    await roleInstance.save();

    return roleInstance;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al actualizar el Role: ${error.message}`);
  }
};

// Eliminar un Role por ID
const deleteRole = async (id) => {
  try {
    const roleInstance = await Role.findByPk(id);

    if (!roleInstance) {
      throw new Error('Role no encontrado');
    }

    await roleInstance.destroy();
    return { message: 'Role eliminado exitosamente' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al eliminar el Role: ${error.message}`);
  }
};

// Obtener el rol por nombre
const checkRoleExists = async (role) => {
  try {
    if (!role) {
      throw new Error('role es requerido');
    }

    const existingRole = await Role.findOne({ where: { role } });
    return existingRole;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el rol: ${error.message}`);
  }
};


module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  checkRoleExists,
};
