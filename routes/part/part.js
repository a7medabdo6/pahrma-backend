const  express = require("express")
const joi =require("joi")
const { Model } = require("mongoose")
const router =express.Router()
const mongoose = require('mongoose');
const {validateUser,Part} = require("../../model/part/part")
const auth = require("../../middleware/auth") // للحمايه من اى حد يضيف
const admin = require("../../middleware/admin") // للحمايه من اى حد يضيف
const multer = require('multer');
const path = require('path');

router.get("/",async (req,res)=>{
    const getpart = await  Part.find().sort("name")
    // res.send(path.join(__dirname, '/uploads/' + req.file));

    res.send(getpart)
    })



    router.get("/pages",async (req,res)=>{

      const { page = 1, limit=4} = req.query
      const getpart = await  Part.find()
      .sort("name")
      .limit(limit * 1)
      .skip((page - 1) * limit).exec()
      res.send(getpart)
      })


    router.get("/:id",async(req,res)=>{



    try {
      const findpart =await Part.findById(req.params.id)

      if(!findpart){
        res.status(404).send("not")

    }
res.send(findpart)
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
        
   const product = new Part({
    FullName : req.body.FullName,
    photo: req.file ? req.file.filename : undefined, // Set photo to undefined if req.file is not available
  })
 
 
       const {error} =validateUser(req.body)

        if(error){
          return  res.send(error.details[0].message)
        }else{
           await product.save()
          //  console.log(req.file,"77777");
           const response = {
            // photo: req.file.filename,
            data:product
          };
            res.send(response)
        }
        //   console.log(result);
       
       

    })

    router.put("/:id",upload.single('photo'),async(req,res)=>{
  
try {

  const {error} =validateUser(req.body)

  if(error){
    return  res.send(error.details[0].message)
  }else{
      const updateproduct = await  Part.findByIdAndUpdate(req.params.id,{
          FullName : req.body.FullName,
          photo:req.file.filename

      },{new:true})
      if(!updateproduct){
          return  res.status(404).send("invalid Id")
        }
      res.send(updateproduct)
  }
} catch (error) {
  res.send("invalid Id")

}
      

    

    })


    router.delete("/:id",[auth,admin],async(req,res)=>{
        const Findproduct = await  Product.findByIdAndRemove(req.params.id)     
           if(!Findproduct){
            return  res.status(404).send("this Product is not found")
      
          }
         

  res.send(Findproduct)
  
    })




          module.exports = router