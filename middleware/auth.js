const jwt =require("jsonwebtoken")



module.exports = function (req,res,next){
    const token  =req.header("x-auth-token") //جلب التوكين
    if(!token){
        return res.status(401).send("access rejected....")
    }
    
    
    try {
        const decodeToken = jwt.verify(token,"PrivateKey")
        req.user =decodeToken
        next()
        
    } catch (error) {
        return res.status(400).send("wrong token....")

    }
}