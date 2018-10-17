'use strict'

const Joi = require('joi');
const MongoModels = require('mongo-models');
const Bcrypt = require('bcryptjs');
//Aqui se definen los modelos de los usuarios(-herencia)


const schema = Joi.object({
    _id: Joi.object(),
    name: Joi.string().required(),
    password: Joi.string(),
    isActive: Joi.boolean(),
    email:Joi.string().email()
});
const adminSchema = Joi.object({
    _id: Joi.object(),
    type:Joi.string(),
    user:Joi.object().keys({
        _id:Joi.object(),
        name: Joi.string().required(),
        password: Joi.string(),
        isActive: Joi.boolean(),
        email:Joi.string().email()
    })
});
class User extends MongoModels{
    static create(userData){
        return this.insertOne(new User(userData))
    }
}

class Admin extends MongoModels{
     static async create(user){
        this._type='admin';
        user['password'] = Bcrypt.hashSync(user.password, 8);
        this._user = await User.create(user)
        let admin = Object.assign({},{user:this._user[0]},{type:'admin'})
        return this.insertOne(admin)
     }

}

class DefaultUser extends MongoModels{
    static async create(user){
        this._type = 'default';
        this._user = await User.create(user)
        let defaultUser = Object.assign({},{user:this._user[0]},{type:'default'})
        return this.insertOne(defaultUser)
    }
}

class UsersFactory{
    constructor(){
        this._users = []
    }
    async checkUnity(userData){
       
        let user = Object.assign({},userData)
        let finder = await User.findOne({email:userData.email})
      
       return finder
    }
    async login(userData){
        return new Promise(async(resolve,reject)=>{ 
            let found = await User.findOne({email:userData.email})
            if(!found)
                return reject(new Error('Usuario no existente'));

            let streq = Bcrypt.compareSync(userData.password,found.password);
        
            if(!found.isActive && streq)
               return reject(new Error('El usuario está inactivo'))
            else if(found && !streq)
                return reject(new Error('Contraseña incorrecta'))
            else    
                return  resolve('Login realizado')

        })
    }
    //modificar usuario
    //eliminar usuario
    //cambiar tipo de usuario
    //resetear contraseña
    //listar usuarios
}
Admin.collectionName = 'admin'; // the mongodb collection name
Admin.schema = adminSchema;
DefaultUser.collectionName='default';
DefaultUser.schema = adminSchema 
User.collectionName = 'user'
User.schema = schema

module.exports.Admin=Admin;
module.exports.DefaultUser=DefaultUser;
module.exports.UsersFactory=UsersFactory;
