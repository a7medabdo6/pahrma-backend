

const mongoose = require('mongoose');
const joi =require("joi")

const Product = require('../ProductModel/ProductModel.js'); // Assuming the Author schema is in a separate file






     

const Categoriesschema = new mongoose.Schema({
    FullName : {
        type:String,
        required:true,
        minlength:3,
        maxlength:44     


        
    },
   
    photo:{
   type:String,

    },  
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    
       }]
})


function validateUser(user) {
    const schema =joi.object( {
        // empID : joi.number().integer().required(),
        FullName :  joi.string().min(3).required(),
        products :joi.string()
    })
        const result = schema.validate(user);
       return result
      }



      const Categories = mongoose.model('Categories', Categoriesschema);



      exports.Categories = Categories
      exports.validateUser = validateUser


