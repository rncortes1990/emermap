const Routes = require('./routes')


function register(server,options){
    server.route(Routes)
    server.log('info','cookies plugin registered')
}


exports.plugin={
    name:'cookies',
    version:'1.0.0',
    register
}