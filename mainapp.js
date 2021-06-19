const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const express = require("express");
require("./DB/connection");
const users = require("./schema/users");

const app = express();
dotenv.config({path:'./config.env'});

const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/",async(req,res)=>{
    res.send("Hello HomePage");
})


//POST API FOR SIGNUP
app.post("/signup", async(req,res)=>{

    const{name,username,password}=req.body;     
    if(!name || !username || !password){             //check if details not entered
        return res.json({error:"Enter all details"});
    }
    try{
        const userexist = await users.findOne({username:username});    //check if username already present or not
        if(userexist){
            return res.status(422).json({error:"Username already present"});
        }
        
        const Users = new users(req.body);      
        const users1 = await Users.save();    //store data
        console.log(users1);                 //show data on nodejs console
        res.status(201).send(users1);        //show data on postman console
    }
    catch(e){
        console.log(e);
        res.status(400).send(e);
    }
})

//POST API FOR LOGIN
app.post("/login", async(req,res)=>{
    try{
        let token;
        const{username, password} = req.body;
        if(!username || !password){                 //check if details entered or not
            return res.status(400).json("enter details");
        }

        const userlogin = await users.findOne({username:username});  //finding username from DB
        const userlogin2 = await users.findOne({password:password});  //finding password from DB

        if(!userlogin || !userlogin2){                              //if didnt found data
            res.status(400).json({error:"Login Unsuccessful"});
        }
        else{
            const token = await userlogin.generateAuthToken();
            res.status(201).json("Login Successful");      //if data is found
        }
    }
    catch(e){
        console.log(e);
    }
})

//POST API FOR REVIEW
app.post("/review", async(req,res)=>{

    const{movie, review, username}=req.body;

    if(!movie || !review || !username){             //check if details not entered
        return res.json({error:"Enter all details"});
    }
   
   try{
        const userexist = await users.findOne({username:username});
        const movieexist = await users.findOne({"movies.movie":req.body.movie});
        if(userexist){
            if(movieexist){
                const result = await users.findOneAndUpdate({username:username}, {
                    $set: {
                        movie:req.body.movie, 
                        review: req.body.review
                        }
                    }, {
                        new: true,
                        findAndModify:false
                    });
                    const resu= await result.save();
                    res.status(201).send(resu);
            }
            else{
            const result = await users.findOneAndUpdate({username:username}, {
                $push: {
                    movies:[{movie:req.body.movie, review: req.body.review} ],
                    }
                }, {
                    new: true,
                    findAndModify:false
                });
            const resu= await result.save();
            res.status(201).send(resu);
            }

        }
        
    }
     catch(e){
         console.log(e);
         res.status(400).send(e);
     }
    })


app.listen(port, ()=>{
    console.log('setup at '+ (port));
})