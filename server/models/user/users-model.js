'use strict'

//Aqui se definen los modelos de los usuarios(-herencia)
class User {
    constructor(userData){
        this._name = userData.name;
        this._password = userData.password;
        this._isActive = userData.isActive
        this._email = userData.email
    }
}

class Admin extends User{
    constructor(userData){
        super(userData);
        this._type='admin';
    }
}

class DefaultUser extends User{
    constructor(userData){
        super(userData);
        this._type = 'default';
    }
}

class UsersFactory{
    constructor(){
        this._users = []
    }
    
    addUser(user){
        this._users.push(user)//insert
    }
    usersTotal(){
        return this._users.length//get length
    }
    getAll(){
        return this._users.slice(0)//findall
    }
    modifyUser(userData){
        let id = userData._id//findBy
    }
}

var usersFactory = new UsersFactory()
var normalUser = new DefaultUser({name:'nico',password:'hola',email:'hola@gmail'})
var adminUser = new Admin({name:'nico',password:'hola',email:'hola@gmail'})
    usersFactory.addUser(normalUser)
    usersFactory.addUser(adminUser)
    
    console.log(usersFactory.getAll())