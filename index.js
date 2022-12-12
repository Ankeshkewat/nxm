const express=require('express');
const cors=require('cors')

const app=express();
app.use(express.json())
app.use(cors())


const {connection}=require("./config/db")
const {todoRouter}=require('./routes/todos.router')


const validator=(req,res,next)=>{
    let data=req.body
    if(data.taskname==undefined||data.status==undefined||data.tag==undefined){
        res.send({"ERR":"Please give all fields"})
    }
    else{
        next()
    }
}

app.post('/signup',todoRouter)
app.post('/login',todoRouter)
app.get('/todos',todoRouter)
app.patch('/edit/:userId',todoRouter)
app.delete('/delete/:userId',todoRouter)
app.post('/post',validator,todoRouter)

app.listen(1300,async()=>{
    try{
   await connection
   console.log("Connected to database")
   console.log('listening in pport 1300')
    }
    catch(err){
        console.log(err);
    }
})