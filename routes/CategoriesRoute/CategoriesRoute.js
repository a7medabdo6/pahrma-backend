const express = require("express"); // استيراد مكتبة إكسبريس
const joi = require("joi"); // استيراد مكتبة جوي
const router = express.Router(); // إنشاء مسار جديد
const mongoose = require('mongoose'); // استيراد مكتبة مونجوس
const auth = require("../../middleware/auth"); // وسيط المصادقة
const admin = require("../../middleware/admin"); // وسيط المشرف
const multer = require('multer'); // استيراد مكتبة مولتر
const path = require('path'); // استيراد مكتبة الطريق
const { validateUser, Categories } = require("../../model/CategoriesModel/CategoriesModel.JS"); // استيراد نموذج المستخدم والفئات

// مسار الحصول على جميع الفئات
router.get("/", async (req, res) => {
  const getCategories = await Categories.find().populate("products"); // الحصول على جميع الفئات مع بيانات المؤلف المرتبطة
  res.send(getCategories); // إرسال الرد
});

// مسار الحصول على صفحات الفئات
router.get("/pages", async (req, res) => {
  const { page = 1, limit = 4 } = req.query; // الحصول على الصفحة والحد
  const getCategories = await Categories.find()
    .sort("name")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec(); // الحصول على الفئات بحسب الصفحة والحد
  res.send(getCategories); // إرسال الرد
});

// مسار الحصول على فئة بواسطة الهوية
router.get("/:id", async (req, res) => {
  try {
    const findCategories = await Categories.findById(req.params.id).populate("products"); // البحث عن الفئة بواسطة الهوية مع بيانات المؤلف المرتبطة

    if (!findCategories) {
      res.status(404).send("not"); // إرسال رسالة الخطأ إذا لم يتم العثور على الفئة
    }
    res.send(findCategories); // إرسال الرد
  } catch (error) {
    res.send("not found id"); // إرسال رسالة الخطأ في حالة وجود خطأ في البحث
  }
});

// إعداد وجهة تخزين الملفات المرفوعة
const storage = multer.diskStorage({
  destination: './uploads/', // المجلد المستهدف
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // إعداد اسم الملف المرفوع
  }
});

// تهيئة مكتبة مولتر
const upload = multer({ storage: storage });

// مسار إنشاء فئة جديدة
router.post("/", upload.single('photo'), async (req, res) => {
  const Categoriesone = new Categories({
    FullName: req.body.FullName,
    photo: req.file ? req.file.filename : undefined, // إعداد الصورة المرفوعة (إذا كانت متاحة)
    products: [req.body.products], // إعداد مؤلف الفئة
  });

  const { error } = validateUser(req.body); // التحقق من صحة بيانات المستخدم

  if (error) {
    return res.send(error.details[0].message); // إرسال رسالة الخطأ في حالة وجود خطأ في البيانات
  } else {
    await Categoriesone.save(); // حفظ الفئة في قاعدة البيانات
    const response = {
      data: Categoriesone // إعداد الرد
    };
    res.send(response); // إرسال الرد
  }
});

// مسار تحديث فئة بواسطة الهوية
router.put("/:id", upload.single('photo'), async (req, res) => {
    try {
      const CategoriesId = req.params.id; // هوية الفئة
      const updatedCategoriesData = req.body; // بيانات الفئة المحدثة
      const newproductsId = req.body.products; // هوية المؤلف الجديد
  
      // التحقق من صحة بيانات الفئة المحدثة
      const { error } = validateUser(updatedCategoriesData);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
  
      // العثور على الفئة بواسطة الهوية
      const categories = await Categories.findById(CategoriesId);
      if (!categories) {
        return res.status(404).send("سلة التسوق غير موجودة");
      }
  
      // التحقق مما إذا كان المؤلف الجديد موجودًا بالفعل في الصفيف
      if (categories.products.includes(newproductsId)) {
        return res.status(400).send("المؤلف موجود بالفعل في الفئة");
      }
  
      // إضافة المؤلف الجديد إلى الصفيف
      categories.products.push(newproductsId);
  
      // حفظ الفئة المحدثة
      const updatedCategories = await categories.save();
  
      res.send(updatedCategories); // إرسال الرد
    } catch (error) {
      console.error(error);
      res.status(500).send("خطأ في الخادم الداخلي");
    }
  });
  

// مسار حذف فئة بواسطة الهوية
router.delete("/:id", [auth, admin], async (req, res) => {
  const FindCategories = await Categories.findByIdAndRemove(req.params.id);

  if (!FindCategories) {
    return res.status(404).send("this Product is not found");
  }

  res.send(FindCategories);
});

module.exports = router; // تصدير المسار
