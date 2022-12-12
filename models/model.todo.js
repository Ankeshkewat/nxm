const mongoose=require('mongoose');

const schema=mongoose.Schema({
    taskname:String,
    status:[],
    tag:[]
})

const TodoModel=mongoose.model('todo',schema);

module.exports={
    TodoModel
}