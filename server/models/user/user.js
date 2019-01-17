'use strict'

const {Admin,DefaultUser,UsersFactory} = require('./users-model')
const Joi = require('joi')
const Boom = require('boom')
const Bcrypt = require('bcryptjs')
const TokenCreation = require('../../utils/token');
const secret = require('../../utils/token')
// const Validate = require('../../utils/validation');
const users = {
 
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    
};

exports.Router = {
    name: 'Users',
    version: '1.0.0',
    register: async function (server, options) {
        // Create a route for example
        server.route({
            method: 'POST',
            path: '/login',
            options:{
               auth:'simple',
                validate:{
                    payload:{
                        email:Joi.string().email(),
                        password:Joi.string()
                    }
                }
            },
            handler: async function (request, h) {
                let user = Object.assign({},request.payload)
                let factory = new UsersFactory()
                try{
                      var result = await factory.login(user)
                      console.log(result)
                     return result 
                }catch(err){
                    return  Boom.badRequest(err)
                }
              
            }
        });
        server.route({
            method: 'DELETE',
            path: '/user/{id_user}',
            handler: function (request, h) {
                return 'hello, world'+JSON.stringify(request.payload);
            }
        });
        // server.route({
        //     method: 'POST',
        //     path: '/users',
        //     // options:{
        //     //     auth:'simple'
        //     // },
        //     handler: function (request, h) {
        //         /** front end para gestion de usuarios */    
        //         return 'hello, world';
        //     }
        // });
        server.route({
            method: 'POST',
            path: '/users',
            options:{
                validate:{
                    payload:{
                        user:Joi.object().keys({
                            name:Joi.string(),
                            password:Joi.string(),
                            isActive:Joi.boolean(),
                            email:Joi.string()
                        }),
                        isAdmin:Joi.boolean()
                    }
                },
                // pre:[
                //     {//aqui ira la autenticacion con scopes
                //         assign:'pre1',
                //         method:function(request,h){
                //             console.log('holi')
                //             return 'hola!'
                //         }

                //     }
                // ]
            },
            handler: async function (request, h) {

                try{
                    // return await h.response(request.payload).takeover()

                    let factory = new UsersFactory()
                    let user = Object.assign({},request.payload.user)
                    let resulting = await factory.checkUnity(user)
                    var tokenId;
                    if(resulting){
                        return Boom.badRequest(new Error('El usuario ya existe!'))
                    }
                    if(request.payload.isAdmin){
                        let adminUser = await Admin.create(user)
                            tokenId = TokenCreation(adminUser[0])
                    }
                    else{
                        let defaultUser = await DefaultUser.create(user)
                            tokenId = TokenCreation(defaultUser[0])
                    }
                }catch(err){
                    return Boom.badRequest(err.message)
                }  
                
                
                return h.response({
                    message:`El Usuario ha sido exitosamente ingresado`,
                    tokenId
                });
            }
        });

        server.route({
            method: 'POST',
            path: '/users/default',
            handler: function (request, h) {

                return 'this service is for creating defaults';
            }
        });
    }
};

exports.Router.attributes={
    name:'users-routes'
}