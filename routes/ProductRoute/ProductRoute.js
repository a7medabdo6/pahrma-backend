const  express = require("express")
const joi =require("joi")
const { Model } = require("mongoose")
const router =express.Router()
const mongoose = require('mongoose');
const {validateUser,Product} = require("../../model/ProductModel/ProductModel")
const auth = require("../../middleware/auth") // للحمايه من اى حد يضيف
const admin = require("../../middleware/admin") // للحمايه من اى حد يضيف
const multer = require('multer');
const path = require('path');

router.get("/",async (req,res)=>{
    const getProduct = await  Product.find().sort("name")
    // res.send(path.join(__dirname, '/uploads/' + req.file));

    res.send(getProduct)
    })



    router.get("/pages",async (req,res)=>{

      const { page = 1, limit=4} = req.query
      const getProduct = await  Product.find()
      .sort("name")
      .limit(limit * 1)
      .skip((page - 1) * limit).exec()
      res.send(getProduct)
      })


    router.get("/:id",async(req,res)=>{



    try {
      const findProduct =await Product.findById(req.params.id)

      if(!findProduct){
        res.status(404).send("not")

    }
res.send(findProduct)
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
        
   const product = new Product({
    FullName : req.body.FullName,
    EnName : req.body.EnName,
    discountpercentage : req.body.discountpercentage,
    pricebefordiscount : req.body.pricebefordiscount,
    priceafterdiscount : req.body.priceafterdiscount,
    price : req.body.price,

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

    router.put("/:id",[upload.single('photo'),auth,admin],async(req,res)=>{
  
try {

  const {error} =validateUser(req.body)

  if(error){
    return  res.send(error.details[0].message)
  }else{
      const updateproduct = await  Product.findByIdAndUpdate(req.params.id,{
        FullName : req.body.FullName,
        EnName : req.body.EnName,
        discountpercentage : req.body.discountpercentage,
        pricebefordiscount : req.body.pricebefordiscount,
        priceafterdiscount : req.body.priceafterdiscount,
        price : req.body.price,
    
        photo: req.file ? req.file.filename : undefined, // Set photo to undefined if req.file is not available

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