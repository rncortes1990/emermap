const Bcrypt = require('bcryptjs');
const {Admin,DefaultUser,UsersFactory} = require('../models/user/users-model')
/**
 * Algoritmo de validacion para autenticación
 */
const validate = async (request, username, password) => {
  let user = Object.assign({},request.payload.user)

  if (!user) {
      return { credentials: null, isValid: false };
  }

  const isValid = await Bcrypt.compare(password, user.password);
  const credentials = { id: user.id, name: user.name };

  return { isValid, credentials };
};
module.exports = validate;