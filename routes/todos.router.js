const express=require('express');
const bcrybt=require('bcrypt') 
const jwt=require('jsonwebtoken')

const todoRouter=express.Router()

const {UserModel}=require('../models/model.user')
const {TodoModel}=require('../models/model.todo')

//signup
todoRouter.post('/signup',async(req,res)=>{
   const {email,password}=req.body;
   let ip=req.ip
   bcrybt.hash(password,5,async function(err,hash){
    try{
          let data=new UserModel({email,password:hash,ip});
          await data.save();
          res.send({"MSG":"Succesfull"})
    }catch(err){
        console.log(err);
        res.send({"ERR":"Some err"})
    }
   })
})

//login
todoRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body;

    let data=await UserModel.find({email});
    if(data.length>0){
         let hash_pass=data[0].password;
         bcrybt.compare(password,hash_pass, async function(err,result){
            if(err){
                console.log(err);
                res.send({"ERR":"ERR"})
            }
            else if(result){
                let token=jwt.sign({"userId":data[0]._id},'nxm',async function(err,token){
                    if(err){
                        console.log(err);
                        res.send({"ERR":"ERR"})
                    }
                    else if(token){
                        res.send({"MSG":"login succesfull",'token':token})
                    }
                    else{
                        res.send({"ERr":'ERR'})
                    }
                })
            }
         })
    }
    else{
        res.send({"ERR":"Please login"})
    }

   
})

//post
todoRouter.post('/post',async(req,res)=>{
    let token=req.headers.authorization?.split(' ')[1];
    let payload=req.body;
    if(token){
      jwt.verify(token,'nxm',async function(err,decoded){
        if(err){
            console.log(err)
          res.send({'ERR':" err"})
        }
        else if(decoded){
            let data=new TodoModel(payload);
            await data.save();
            res.send({"MSG":"DATA aded"})
        }
        else{
            res.send({'ERR':"Please login"})
        
        }
      })
    }
    else{
        res.send({'ERR':"Please login"})
    }
})


//update
todoRouter.patch('/edit/:userId',async(req,res)=>{
    let token=req.headers.authorization?.split(' ')[1];
    let payload=req.body;
    let userId=req.params.userId;
    if(token){
      jwt.verify(token,'nxm',async function(err,decoded){
        if(err){
            console.log(err)
          res.send({'ERR':" err"})
        }
        else if(decoded){
            await TodoModel.findByIdAndUpdate({_id:userId},payload)
            res.send({"MSG":"DATA Updet"})
        }
        else{
            res.send({'ERR':"Please login"})
        
        }
      })
    }
    else{
        res.send({'ERR':"Please login"})
    }
})

//delete
todoRouter.delete('/delete/:userId',async(req,res)=>{
    let token=req.headers.authorization?.split(' ')[1];
    let userId=req.params.userId;
    if(token){
      jwt.verify(token,'nxm',async function(err,decoded){
        if(err){
            console.log(err)
          res.send({'ERR':" err"})
        }
        else if(decoded){
              await TodoModel.findByIdAndDelete({_id:userId})
            res.send({"MSG":"DATA Deleted"})
        }
        else{
            res.send({'ERR':"Please login"})
        
        }
      })
    }
    else{
        res.send({'ERR':"Please login"})
    }
})

//get
todoRouter.get('/todos',async(req,res)=>{
    let token=req.headers.authorization?.split(' ')[1];
    if(token){
      jwt.verify(token,'nxm',async function(err,decoded){
        if(err){
            console.log(err)
          res.send({'ERR':" err"})
        }
        else if(decoded){
              if(req.query.status==='pending'){
                  let data=await TodoModel.find('pending')
                  res.send(data)
              }
              else{
                let data=await TodoModel.find();
                res.send(data)
              }
        }
        else{
            res.send({'ERR':"Please login"})
        
        }
      })
    }
    else{
        res.send({'ERR':"Please login"})
    }
})
module.exports={
    todoRouter
}