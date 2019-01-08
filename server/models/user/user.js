'use strict'

const {Admin,DefaultUser,UsersFactory} = require('./users-model')
const Joi = require('joi')
const Boom = require('boom')
const Bcrypt = require('bcryptjs')


const users = {
 
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    
};
/**
 * Algoritmo de validacion para autenticación
 */
const validate = async (request, username, password, h) => {
    console.log(username, password)
    if (username === 'help') {
        return { response: h.redirect('https://hapijs.com/help') };     // custom response
    }

    const user = users[username];
    if (!user) {
        return { credentials: null, isValid: false };
    }

    const isValid = await Bcrypt.compareSync(user.password,password);
    const credentials = { id: user.id, name: user.name };

    return { isValid, credentials };
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
        // server.auth.strategy('simple', 'basic', { validate });
        // server.auth.default('simple');
        server.route({
            method: 'POST',
            path: '/users',
            // options:{
            //     auth:'simple'
            // },
            handler: function (request, h) {
                /** front end para gestion de usuarios */    
                return 'hello, world';
            }
        });
        server.route({
            method: 'POST',
            path: '/users/admin',
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
                    if(request.payload.isAdmin)
                        await Admin.create(user)
                    else
                        await DefaultUser.create(user)

                }catch(err){
                    return Boom.badRequest(err)
                }  
                return h.response({message:`El Usuario ha sido exitosamente ingresado`});
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