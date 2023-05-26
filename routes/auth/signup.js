const  express = require("express")
const joi =require("joi")
const { Model } = require("mongoose")
const router =express.Router()
const mongoose = require('mongoose');
const {validateUser, user} = require("../../model/auth/signup")
const _ = require("lodash")
const auth = require("../../middleware/auth") // للحمايه من اى حد يضيف

const bcrypt = require('bcrypt');  // مكتبه التشفير
const saltRounds = 10;  // عدد الحروف الزياده على التشفير بتاع الباسورد






router.post("/", async(req,res)=>{

let email = await user.findOne({mail:req.body.mail})  // البحث عن الاايميل اذا كان مسجل ن قبل ام لا
if(email){
    return  res.status(404).send("email is used")
  }
    const User = new user(_.pick(req.body,["FullName","mail","password","isAdmin","age","gender","phone"]))  // هنا يتم اخذ نسخه من ايوزر ليتم عمل عليه نسخه اخرى 
 
  
        const {error} =validateUser(req.body)  // هنا التحقق من وجود اخطاء في المخلات اذا وجددت لا يتم لارسال من الاساس
 
         if(error){
           return  res.status(404).send(error.details[0].message)
         }else{
            const salt = await bcrypt.genSalt(saltRounds)

            User.password = await bcrypt.hash( User.password , salt)  // هنا يتم تشفير الباسورد 
            await User.save()  // بعد تشفير الباسورد هنا يتم حفظ البيانات في قاعده البيانات
            const token =User.generateToken()  // تقوم بعمل توكين 
           res.header("x-auth-token",token).send(User) /// هنا يتم ارسال البيانات الى المستخدم والتوكين الى الهيدر

            //  res.send(_.pick(User,["FullName","mail","_id"]))
         }
         //   console.log(result);
        
        
 
     })

     module.exports = router