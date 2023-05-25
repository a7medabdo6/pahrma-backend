const  express = require("express")
const compression = require('compression')
var cors = require('cors')
require('express-async-errors');
const mongoose = require('mongoose');

const helmet =require("helmet")
const app =express()
const morgan = require('morgan')
const logger = require('./config/logger')



mongoose.connect('mongodb://127.0.0.1:27017/pharma')
  .then(() => console.log('Connected!'))
  .catch(() => console.log('faild'))
  

  const signin = require("./routes/auth/signin")
  const signup = require("./routes/auth/signup")
  const omega = require("./routes/vitamin/omega")
  const profile = require("./routes/user/profile")


  app.use(express.json())
app.use(cors())
  app.use(helmet());
  app.use(compression())
app.use(morgan('tiny'));
app.use("/api/user/signin",signin);
app.use("/api/user/signup",signup);
app.use("/api/user",profile);

app.use("/api/omega",omega);









app.all("*",(req,res,next) =>{
  res.status(404).json({
    status:"false",
    message:"page not found !"
  })
})

const port = process.env.port || 3000;
app.listen(port,()=>{logger.error("app work");});