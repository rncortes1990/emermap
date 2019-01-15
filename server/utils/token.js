'use strict'

const jwt = require('jsonwebtoken');
const secret = require('./config').key;

function createToken(user){
    let scopes;
    console.log(user)
    if(user.type.toLowerCase()=='admin'){
        scopes='admin';
    }

    return jwt.sign(
        {
            id:user.user._id,
            username:user.user.username,
            email:user.user.email,
            scope:scopes
        },
            secret,
        {
            algorithm:'HS256',
            expiresIn:'1h'
        });
        
}

module.exports = createToken;