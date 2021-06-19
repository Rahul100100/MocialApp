const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path:'./config.env'});


mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log("connection successful")
}).catch((e)=>{
    console.log("no connection");
})