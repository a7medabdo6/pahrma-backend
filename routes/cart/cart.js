const express = require("express");
const joi = require("joi");
const router = express.Router();
const mongoose = require('mongoose');
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const multer = require('multer');
const path = require('path');
const {validateUser,Cart} = require("../../model/cart/cart")







router.get("/",async (req,res)=>{
    const getcart = await  Cart.find().populate("author")
    // res.send(path.join(__dirname, '/uploads/' + req.file));

    res.send(getcart)
    })



    router.get("/pages",async (req,res)=>{

      const { page = 1, limit=4} = req.query
      const getcart = await  Cart.find()
      .sort("name")
      .limit(limit * 1)
      .skip((page - 1) * limit).exec()
      res.send(getcart)
      })


    router.get("/:id",async(req,res)=>{



    try {
      const findcart =await Cart.findById(req.params.id).populate("author")

      if(!findcart){
        res.status(404).send("not")

    }
res.send(findcart)
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

      
   const cartone = new Cart({
    FullName : req.body.FullName,
    price : req.body.price,
    photo:req.file.filename,
    author:[req.body.author],
    
   })
 
 
       const {error} =validateUser(req.body)

        if(error){
          return  res.send(error.details[0].message)
        }else{
           await cartone.save()
          //  console.log(req.file,"77777");
           const response = {
            // photo: req.file.filename,
            data:cartone
          };
            res.send(response)
        }
        //   console.log(result);
       
       

    })

 
    
// تحديث سلة التسوق بواسطة المعرف
router.put("/:id", upload.single('photo'), async (req, res) => {
  try {
    const cartId = req.params.id;
    const updatedCartData = req.body;
    const newAuthorId = req.body.author;

    // التحقق من صحة بيانات سلة التسوق المحدثة
    const { error } = validateUser(updatedCartData);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // العثور على سلة التسوق حسب المعرف
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).send("سلة التسوق غير موجودة");
    }

    // إضافة المؤلف الجديد إلى الصفيف الموجود من المؤلفين
    cart.author.push(newAuthorId);

    // حفظ سلة التسوق المحدثة
    const updatedCart = await cart.save();

    res.send(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("خطأ في الخادم الداخلي");
  }
});

    


    router.delete("/:id",[auth,admin],async(req,res)=>{
        const Findcart = await  Cart.findByIdAndRemove(req.params.id)     
           if(!Findcart){
            return  res.status(404).send("this Product is not found")
      
          }
         

  res.send(Findcart)
  
    })




          module.exports = router