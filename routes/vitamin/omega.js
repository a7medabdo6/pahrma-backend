const  express = require("express")
const joi =require("joi")
const { Model } = require("mongoose")
const router =express.Router()
const mongoose = require('mongoose');
const {validateUser,omega} = require("../../model/vitamin/omega")
const auth = require("../../middleware/auth") // للحمايه من اى حد يضيف
const admin = require("../../middleware/admin") // للحمايه من اى حد يضيف
const multer = require('multer');
const path = require('path');

router.get("/",async (req,res)=>{
    const getomega = await  omega.find().sort("name")
    // res.send(path.join(__dirname, '/uploads/' + req.file));

    res.send(getomega)
    })



    router.get("/pages",async (req,res)=>{

      const { page = 1, limit=4} = req.query
      const getomega = await  omega.find()
      .sort("name")
      .limit(limit * 1)
      .skip((page - 1) * limit).exec()
      res.send(getomega)
      })


    router.get("/:id",async(req,res)=>{



    try {
      const findomega =await omega.findById(req.params.id)

      if(!findomega){
        res.status(404).send("not")

    }
res.send(findomega)
    } catch (error) {
      res.send("not found id")

    }
  
})

    
// Set storage destination for uploaded files
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer
const upload = multer({ storage: storage });

    router.post("/", upload.single('photo'), async(req,res)=>{
   const omegaone = new omega({
    FullName : req.body.FullName,
    price : req.body.price,
    photo:req.file.filename
   })
 
 
       const {error} =validateUser(req.body)

        if(error){
          return  res.send(error.details[0].message)
        }else{
           await omegaone.save()
          //  console.log(req.file,"77777");
           const response = {
            // photo: req.file.filename,
            data:omegaone
          };
            res.send(response)
        }
        //   console.log(result);
       
       

    })

    router.put("/:id",async(req,res)=>{
  
try {

  const {error} =validateUser(req.body)

  if(error){
    return  res.send(error.details[0].message)
  }else{
      const updateOmega = await  omega.findByIdAndUpdate(req.params.id,{
          FullName : req.body.FullName,
          price : req.body.price

      },{new:true})
      if(!updateOmega){
          return  res.status(404).send("invalid Id")
        }
      res.send(updateOmega)
  }
} catch (error) {
  res.send("invalid Id")

}
      

    

    })


    router.delete("/:id",[auth,admin],async(req,res)=>{
        const Findomega = await  omega.findByIdAndRemove(req.params.id)     
           if(!Findomega){
            return  res.status(404).send("this Product is not found")
      
          }
         

  res.send(Findomega)
  
    })




          module.exports = router