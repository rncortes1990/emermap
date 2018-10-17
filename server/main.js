'use strict';

const Hapi=require('hapi');
const Users = require('./models/user/user')
const MongoModels = require('mongo-models')


// Create a server with a host and port
const server=Hapi.server({
    host:'0.0.0.0',
    port:8000
});
const connection = {
    // uri: process.env.MONGODB_URI,
    // db: process.env.MONGODB_NAME
    uri: 'mongodb://192.168.99.100:27017/',
    db: 'test'
};

server.route({
    path:'/{name*}',
    method:'GET',
    handler:async function(request,response){
        request.logger.info('In handler %s', request.path);

        return `Hello, ${encodeURIComponent(request.params.name)}!`;
    }
})

process.on('unhandledRejection', (err) => {

    console.log(err,'contact developers team!');
    process.exit(1);
});




module.exports.server = async function start() {

    try {
        await MongoModels.connect(connection, {});
        await server.register([{
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
            },
    ]);
        await server.start();

    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};