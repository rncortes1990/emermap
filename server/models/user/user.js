'use strict'

const {Admin,DefaultUser,UsersFactory} = require('./users-model')
const Joi = require('joi')
const Boom = require('boom')
const Bcrypt = require('bcryptjs')
const secret = require('../../utils/token')
// const Validate = require('../../utils/validation');

exports.Router = {
    name: 'Users',
    version: '1.0.0',
    register: async function (server, options) {

        // Create a route for example
    
        server.route({
            method: 'POST',
            path: '/login',
            options:{
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
                      let { _id:userid , name , email } = result.user 

                      request.yar.set('username',{
                            userid,name,email
                        })

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
                    if(resulting){
                        return Boom.badRequest(new Error('El usuario ya existe!'))
                    }
                    if(request.payload.isAdmin){
                        let adminUser = await Admin.create(user)
                    }
                    else{
                        let defaultUser = await DefaultUser.create(user)
                    }
                }catch(err){
                    return Boom.badRequest(err.message)
                }  
                
                
                return h.response({
                    message:`El Usuario ha sido exitosamente ingresado`,
                });
            }
        });
    }
};

exports.Router.attributes={
    name:'users-routes'
}