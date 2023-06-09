

const mongoose = require('mongoose');
const joi =require("joi")


const omega = mongoose.model("omega",new mongoose.Schema({
    FullName : {
        type:String,
        required:true,
        minlength:3,
        maxlength:44
    },
    price :  {
        type:Number,
        required:true,
        
    },
    photo:{
   type:String,

    }
}))


function validateUser(user) {
    const schema =joi.object( {
        // empID : joi.number().integer().required(),
        FullName :  joi.string().min(3).required(),
        price : joi.number().integer().required(),
    })
        const result = schema.validate(user);
       return result
      }



      exports.omega = omega
      exports.validateUser = validateUser
