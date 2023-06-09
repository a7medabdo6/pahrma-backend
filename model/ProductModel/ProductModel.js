

const mongoose = require('mongoose');
const joi =require("joi")


const productSchema =new mongoose.Schema({
    FullName : {
        type:String,
        required:true,
       
    },
    EnName : {
        type:String,
        required:true,
       
    },
    discountpercentage : {
        type:Number,
        required:true,
       
    },
    pricebefordiscount : {
        type:Number,
        required:true,
       
    },
    priceafterdiscount : {
        type:Number,
        required:true,
       
    },
    price : {
        type:Number,
        required:true,
       
    },
    photo:{
        type:String,

         },
      

})


function validateUser(user) {
    const schema =joi.object( {
        // empID : joi.number().integer().required(),
        FullName :  joi.string().min(3).required(),
        EnName :  joi.string().min(3).required(),

        discountpercentage : joi.number().integer().required(),
        pricebefordiscount : joi.number().integer().required(),
        priceafterdiscount : joi.number().integer().required(),
        price : joi.number().integer().required(),

        photo :  joi.string(),

    })
        const result = schema.validate(user);
       return result
      }

      const Product = mongoose.model('Product', productSchema);


      exports.Product = Product
      exports.validateUser = validateUser
