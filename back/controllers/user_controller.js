const User = require('../models/user');
const Role = require('../models/role');
const BookRoom = require('../models/book_room');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Obtener un dealer aleatorio
const getRandomDealer = async () => {
  try {
    const dealers = await User.findAll({
      include: [
        { model: Role, where: { role: 'dealer' }, required: true }
      ]
    });

    if (dealers.length === 0) {
      throw new Error('No hay dealers disponibles');
    }

    const randomDealer = dealers[Math.floor(Math.random() * dealers.length)];
    return randomDealer.id;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener un dealer aleatorio: ${error.message}`);
  }
};

// Crear un User
const createUser = async ({ name, password, email, username, role_id, book_room_id }) => {
  try {
    if (!name) {
      throw new Error('name es requerido');
    }

    if (!password) {
      throw new Error('password es requerido');
    }

    if (!email) {
      throw new Error('email es requerido');
    }

    if (!username) {
      throw new Error('username es requerido');
    }

    if (!role_id) {
      throw new Error('role_id es requerido');
    }

    const nuevoUser = await User.create({ name, password, email, username, role_id, book_room_id });
    return nuevoUser;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al crear el User: ${error.message}`);
  }
};

// Obtener todos los Users
const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener los Users: ${error.message}`);
  }
};

// Obtener un User por ID
const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: BookRoom }
      ]
    });
    if (!user) {
      throw new Error('User no encontrado');
    }

    return user;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el User: ${error.message}`);
  }
};

// Actualizar un User por ID
const updateUser = async (id, { name, password, email, username }) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User no encontrado');
    }

    if (!name) {
      throw new Error('name es requerido');
    }

    if (!password) {
      throw new Error('password es requerido');
    }

    if (!email) {
      throw new Error('email es requerido');
    }

    if (!username) {
      throw new Error('username es requerido');
    }

    user.name = name;
    user.password = password;
    user.email = email;
    user.username = username;
    await user.save();

    return user;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al actualizar el User: ${error.message}`);
  }
};

// Eliminar un User por ID
const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User no encontrado');
    }

    await user.destroy();
    return { message: 'User eliminado exitosamente' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al eliminar el User: ${error.message}`);
  }
};

// Obtener un User por username
const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ 
      where: { username },
      include: [
        { model: Role}
      ] 
    });

    if (!user) {
      throw new Error('User no encontrado');
    }

    return user;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el User: ${error.message}`);
  }
};

// Asignar un rol a un usuario
const assignRoleToUser = async (userId, roleId) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User no encontrado');
    }

    const role = await Role.findByPk(roleId);

    if (!role) {
      throw new Error('Role no encontrado');
    }

    user.role_id = roleId;
    await user.save();

    return user;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al asignar rol al usuario: ${error.message}`);
  }
};

// SignIn method
const signIn = async ({ username, password }) => {
  try {
    if (!username) {
      throw new Error('username es requerido');
    }

    if (!password) {
      throw new Error('password es requerido');
    }

    const user = await User.findOne({
      where: { username },
      include: [
        { model: Role }
      ]
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    console.log("password" + password + "y user.password:" + user.password)
    if (password !== user.password) {
      throw new Error('Contraseña incorrecta');
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
      { expiresIn: '7d' }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.name,
        usuario: {
          role: user.role.role
        }
      }
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al iniciar sesión: ${error.message}`);
  }
};

// Get session method
const getSession = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    const user = await User.findByPk(decoded.id, {
      include: [
        { model: Role }
      ]
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        nombre: user.name,
        usuario: {
          role: user.role.role
        }
      }
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener sesión: ${error.message}`);
  }
};

// Refresh token method
const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret');
    const user = await User.findByPk(decoded.id, {
      include: [
        { model: Role }
      ]
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    return { accessToken };
  } catch (error) {
    console.error(error);
    throw new Error('Token de refresco inválido');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByUsername,
  assignRoleToUser,
  getRandomDealer,
  createUser,
  signIn,
  getSession,
  refreshToken,
};
