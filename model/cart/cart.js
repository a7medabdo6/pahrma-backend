

const mongoose = require('mongoose');
const joi =require("joi")

const Part = require('../part/part'); // Assuming the Author schema is in a separate file






     

const Cartschema = new mongoose.Schema({
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

    },  
    author:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Part",
    
       }]
})


function validateUser(user) {
    const schema =joi.object( {
        // empID : joi.number().integer().required(),
        FullName :  joi.string().min(3).required(),
        price : joi.number().integer().required(),
        author: joi.required() // Add partment property to the schema

    })
        const result = schema.validate(user);
       return result
      }



      const Cart = mongoose.model('Cart', Cartschema);



      exports.Cart = Cart
      exports.validateUser = validateUser


