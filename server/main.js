'use strict';

require('dotenv').config();
const Hapi=require('hapi');
const path = require('path');
const shell = require('shelljs');
const Users = require('./models/user/user');// Enrutador de servicios de usuarios
const MongoModels = require('mongo-models');
const UnhandledRejection = require('./utils/logger').UnhandledRejectionLogger;
const LoggerOptions = require('./utils/logger-options');
const secret = require('./utils/token')
const Validate = require('./utils/validation');

/**
 * se crea server con host y puerto
 */
const server=Hapi.server({
    host:'0.0.0.0',
    port:8000
});
const connection = {
    uri: `mongodb://${process.env.MONGODB_URI}/`,
    db: process.env.MONGODB_NAME
};

/**
 * Logger para rejections
 */
process.on('unhandledRejection', (err) => {
    console.log(err,'contact developers team!');
    var errNDate = err + new Date().toISOString()
    UnhandledRejection.doLog(hola ,'unhandledRejections');
    process.exit(1);
});


/** 
 * Seteo de plugins y middlewares para la app web
*/
module.exports.server = async function start() {

    try {
        await MongoModels.connect(connection, { useNewUrlParser: true});
        await server.register([
            {
                plugin:require('hapi-auth-basic')
            },
            {
                plugin: require('good'),
                options:LoggerOptions
            },
            {
                    plugin:Validate
            },
            {
                plugin: Users.Router,
                routes: {
                    prefix: '/api/v1'
                }
            },
            {
                plugin:require('hapi-auth-jwt2'),
            }
            ]);

            server.route({
                path:'/{name*}',
                method:'GET',
                options:{
                    auth:'simple'
                },
                handler:async function(request,response){

            
                    // return `Hello, ${encodeURIComponent(request.params.name)}!`;
                    return `<h1>Emermap login</h1><br>usuario: <input placeholder="nombre"/><br>clave:<input type="password" placeholder="clave"/>`;
                }
            })
        await server.start();
        
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};