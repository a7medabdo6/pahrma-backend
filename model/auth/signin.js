const joi =require("joi")

const mongoose = require('mongoose');

const auth = mongoose.model("auth",new mongoose.Schema({

    mail :  {
        type:String,
        required:true,
        unique:true,
        minlength:3,
        maxlength:255
        
    },
    password :  {
        type:String,
        required:true,
        minlength:8,
        maxlength:1024
        
    },
}))


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



      exports.auth = auth
      exports.validate = validate