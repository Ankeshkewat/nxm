const mongoose=require('mongoose');

const schema=mongoose.Schema({
    email:String,
    password:String,
    ip:String
})

const UserModel=mongoose.model('user',schema);

module.exports={
    UserModel
}