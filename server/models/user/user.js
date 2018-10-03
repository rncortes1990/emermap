const Users = require('./users-model')

exports.Router = {
    name: 'Users',
    version: '1.0.0',
    register: async function (server, options) {

        // Create a route for example

        server.route({
            method: 'GET',
            path: '/users',
            handler: function (request, h) {

                return 'hello, world';
            }
        });
        server.route({
            method: 'POST',
            path: '/users/admin',
            handler: function (request, h) {

                return 'this service is for creating admins';
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