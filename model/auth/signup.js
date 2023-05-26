const joi =require("joi")
const jwt =require("jsonwebtoken")

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    FullName : {
        type:String,
        required:true,
        minlength:3,
        maxlength:44
    },
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
    phone : {
        type:Number,
        required:true,
        minlength:11,
        maxlength:11
    },
    age : {
        type:Number,
        required:true,
        minlength:1,
        maxlength:3
    },
    gender : {
        type:String,
        required:true,
        minlength:3,
        maxlength:44
    },
    isAdmin :  Boolean
})
//// هذه الداله لصناعه التوكين
userSchema.methods.generateToken = function (){
    const token =jwt.sign({_id:this._id,isAdmin:this.isAdmin},"PrivateKey")
return token
}
const user = mongoose.model("User",userSchema)


function validateUser(user) {
    const schema =joi.object( {
        // empID : joi.number().integer().required(),
        FullName :  joi.string().min(3).max(44).required(),
        mail : joi.string().min(3).max(255).required().email(),
        password :  joi.string().min(8).max(255).required(),
        age :  joi.number().required(),
        phone :  joi.number().required(),
        gender :  joi.string().required(),

        isAdmin : joi.boolean()

    })
        const result = schema.validate(user);
       return result
      }



      exports.user = user
      exports.validateUser = validateUser