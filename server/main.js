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
const Boom = require('boom')
/**
 * se crea server con host y puerto
 */
const server=Hapi.Server({
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
    UnhandledRejection.doLog(errNDate ,'unhandledRejections');
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
                plugin:require('hapi-auth-bearer-token'),
            },
            {
                plugin: require('yar'),
                options: require('./utils/cookie-options')
            },
            {
                plugin: require('good'),
                options:LoggerOptions
            },
            {
                plugin:require('./cookietest/'),
                routes:{
                    prefix:'/apo'
                }
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
            ]);
            server.route({
                method: 'GET',
                path: '/',
                config: {
                    auth: {
                        strategy:'default',
                        scope:['users']
                    },
                    handler: function (request, h) {
                        
                        return request.auth.credentials.user;
                    }
                }
            });
        await server.start();
        
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};