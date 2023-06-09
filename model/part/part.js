

const mongoose = require('mongoose');
const joi =require("joi")


const partSchema =new mongoose.Schema({
    FullName : {
        type:String,
        required:true,
       
    },
    photo:{
        type:String,

         }

})


function validateUser(user) {
    const schema =joi.object( {
        // empID : joi.number().integer().required(),
        FullName :  joi.string().min(3).required(),
        photo :  joi.string(),

    })
        const result = schema.validate(user);
       return result
      }

      const Part = mongoose.model('Part', partSchema);


      exports.Part = Part
      exports.validateUser = validateUser
