'use strict'


module.exports=[
    {
        method:'GET',
        path:'/createcookie',
        options:{cache: { expiresIn: 5000 }},
        handler:async function(request,h){
            request.yar.set('username', { username: 'nico' });
            return 'cookie creada'
        }
    },
    {
        method:'GET',
        path:'/getcookie',
        options:{
            pre:[
                {
                    assign:'cookie',
                    method:async(request,h)=>{
                        var cookie = request.yar.get('username')
                        if(!cookie){
                            return Boom.badRequest('Sin cookie, debe loggear')
                        }
                            return h.continue
                    }
                }]
        },
        handler:async function(request,h){
            var cookievalor = request.yar.get('username')
                
                      return 'cookievalor'
        }
    },{
        method:'GET',
        path:'/erasecookie',
        handler:async function(request,h){
            request.yar.clear('username')
            console.log(request.yar.get('username'))
              return 'cookie borrada'
        }
    }
]