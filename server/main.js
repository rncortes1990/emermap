'use strict';

require('dotenv').config();
const Hapi=require('hapi');
const path = require('path');
const shell = require('shelljs');
const Users = require('./models/user/user');// Enrutador de servicios de usuarios
const MongoModels = require('mongo-models');

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
server.route({
    path:'/{name*}',
    method:'GET',
    handler:async function(request,response){
        request.logger.info('In handler %s', request.path);

        // return `Hello, ${encodeURIComponent(request.params.name)}!`;
        return `<h1>Emermap login</h1><br>usuario: <input placeholder="nombre"/><br>clave:<input type="password" placeholder="clave"/>`;
    }
})

process.on('unhandledRejection', (err) => {

    console.log(err,'contact developers team!');

    process.exit(1);
});

var hola ='doaiosjdoaisid'
shell.exec(`echo ${hola} >>unhandledRejections.log`)
if (shell.exec('git commit -am "Auto-commit"').code !== 0) {

  }
module.exports.server = async function start() {

    try {
        await MongoModels.connect(connection, { useNewUrlParser: true});
        await server.register([
            {
                plugin:require('hapi-auth-basic')
            },
            {
                plugin: require('hapi-pino'),
                options: {
                    prettyPrint: true,
                    logEvents: ['response']
                    }
            },
            {
                plugin: Users.Router,
                routes: {
                    prefix: '/api/v1'
                }
            }
            ]);
      

        await server.start();

    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};