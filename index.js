const express= require("express");
const mongoose= require("mongoose");
const cookieParser=require("cookie-parser");
const authRoutes = require('./routes/Router');
require('dotenv').config()

mongoose.connect(`${process.env.dbURL }`)
.then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log(err);
})
const app=express();
app.listen(8080,(res,req)=> console.log("running"));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
