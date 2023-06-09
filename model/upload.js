

const mongoose = require('mongoose');
const joi =require("joi")


const upload = mongoose.model("upload",new mongoose.Schema({
    FullName : {
        type:String,
        minlength:3,
        maxlength:44
    },
    price :  {
        type:Number,
        
    },
    file:{
        type:String,
    }
}))


function validateUser(user) {
    const schema =joi.object( {
        // empID : joi.number().integer().required(),
        FullName :  joi.string().min(3),
        price : joi.number().integer(),
       

    })
        const result = schema.validate(user);
       return result
      }



      exports.upload = upload
      exports.validateUser = validateUser
