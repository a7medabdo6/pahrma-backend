const  express = require("express")
const joi =require("joi")
const jwt =require("jsonwebtoken")

const { Model } = require("mongoose")
const router =express.Router()
const mongoose = require('mongoose');
const { user} = require("../../model/auth/signup")
const _ = require("lodash")
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.post("/", async(req,res)=>{

    let User = await user.findOne({mail:req.body.mail})
    if(!User){
        return  res.status(404).send("Invalid Email ")
      }
     
      
            const {error} =validate(req.body)
     
             if(error){
               return  res.status(404).send(error.details[0].message)
             }else{
    
             const  checkpassword =  await bcrypt.compare( req.body.password , User.password)
                if(!checkpassword){
                    return  res.status(404).send("Invalid  Password")
                  }

                  const token =User.generateToken()
                  const response = {
                    token: token,
                    User:User
                  };
                 
                res.send(response)
    
                //  res.send(_.pick(User,["FullName","mail","_id"]))
             }
             //   console.log(result);
            
            
     
         })
    
function validate(req) {
    const schema =joi.object( {
        // empID : joi.number().integer().required(),
        // FullName :  joi.string().min(3).max(44).required(),
        mail : joi.string().min(3).max(255).required().email(),
        password :  joi.string().min(8).max(255).required(),

    })
        const result = schema.validate(req);
       return result
      }
         module.exports = router