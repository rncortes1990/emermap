'use strict'

let options = {
    storeBlank: false,
    cookieOptions: {
        password:process.env.COOKIEPASS,
        isSameSite:'Strict',
        isSecure: false,
        ttl:21684151651
    }
};

module.exports=options;