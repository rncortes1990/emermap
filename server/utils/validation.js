const Bcrypt = require('bcryptjs');
const {Admin,DefaultUser,UsersFactory} = require('../models/user/users-model')
/**
 * Algoritmo de validacion para autenticación
 */
const users = {
  john: {
      email:'raul',
      username: 'john',
      password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
      name: 'John Doe',
      id: '2133d32a'
  }
};

const validate = async (request, username, password) => {
  const user = users[username];
    console.log('pasa por auth')
  if (!user) {
    console.log('asdasdas')
      return { credentials: null, isValid: false };
  }

  const isValid = Bcrypt.compareSync(password, user.password);
  const credentials = { id: user.id, name: user.name };

  return { isValid, credentials };
};
// module.exports = validate;

module.exports = {
  name: 'Auth',
    version: '1.0.0',
    register: async function (server, options) {
      server.auth.strategy(
        'simple',
        'basic',
        {
          validate:validate
        })
        
    }
}