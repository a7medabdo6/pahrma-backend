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



router.get("/profile",auth,async (req,res)=>{
  const profile = await  user.findById(req.user._id).select("-password")
  res.send(profile)
  })


  module.exports = router