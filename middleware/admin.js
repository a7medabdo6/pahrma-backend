const jwt =require("jsonwebtoken")



module.exports = function (req,res,next){
    const token  =req.header("x-auth-token") //جلب التوكين
    if(!req.user.isAdmin){
        return res.status(403).send("you are in not admin....")
    }
    
    next()

}