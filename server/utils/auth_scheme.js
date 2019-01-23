'use strict'
const Boom = require('boom')
const Bcrypt = require('bcryptjs');
const {Admin,DefaultUser,UsersFactory} = require('../models/user/users-model')
/**
 * Algoritmo de validacion para autenticación
 */
const scheme_validation = function(server,options){    
  return {
      authenticate: function (request, h) {
          //Aqui va la logica del auth, puedo hacer lo que quiera, incluso añadir la cookie
          const user ={
              username:'nico'
          }
          console.log('entre al esquema')
          var userv2 = request.yar.get('username')
          if (user.username!=userv2.username) {
              throw Boom.unauthorized(null, 'Custom');
          }
          console.log(options)
          return h.authenticated({ credentials: { user: userv2 ,scope:['admin','users'] } });//el scope va dentro de credentials
      }
  };
}
module.exports = {
  name: 'Auth',
    version: '1.0.0',
    register: async function (server, options) {
      server.auth.scheme('custom', scheme_validation);
      server.auth.strategy('default', 'custom');
    }
}