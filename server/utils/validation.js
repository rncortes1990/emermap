'use strict'
const Boom = require('boom')
const Bcrypt = require('bcryptjs');
const {Admin,DefaultUser,UsersFactory} = require('../models/user/users-model')
/**
 * Algoritmo de validacion para autenticación
 */
async function validateUser(factory,Cookie){//programar promesa
  try{

    let found = await factory.checkUnity(Cookie)//esto debe ser con la sesion

    if(2){
      let error = new Error('El usuario no existe')
      console.trace(error)
      throw error
    }
    return found

  }catch(err){
    return Boom.badData(err)
  }
}
const scheme_validation =  function(server,options){    
  return {
      authenticate: async function (request, h) {
          //Aqui va la logica del auth, puedo hacer lo que quiera, incluso añadir la cookie
          const user ={
              username:'raul@gmail.com'
          }
          console.log('entre al esquema')
          var userCookie = request.yar.get('username')
          let factory = new UsersFactory()
          try {
            var validated = await validateUser(factory,userCookie)
          }catch(err){
            let error = new Error('El usuario no existe')
            console.trace(err)
          }
          console.log(validated)
          if (user.username!=userCookie.email) {
              throw Boom.unauthorized(null, 'Custom');
          }
          return h.authenticated({ credentials: { user: userCookie ,scope:['admin','users'] } });//el scope va dentro de credentials
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