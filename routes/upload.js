
const  express = require("express")
const joi =require("joi")
const { Model } = require("mongoose")
const router =express.Router()
const mongoose = require('mongoose');
const {validateUser,upload} = require("../model/upload")
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Destination folder for storing uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original filename for the uploaded file
    },
  });
  
  // Create a multer upload instance with the configured storage
  const uploadD = multer({ storage: storage });
router.post("/", uploadD.single('file'), async(req,res)=>{
    const Upload = new upload({
     FullName : req.body.FullName,
     price : req.body.price,
     file:req.body.file,
    })
  
  
        const {error} =validateUser(req.body)
 
         if(error){
           return  res.send(error.details[0].message)
         }else{
            await Upload.save()
             res.send(Upload)
         }
         //   console.log(result);
        
        
 
     })


     module.exports = router