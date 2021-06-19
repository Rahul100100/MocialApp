const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config({path:'./config.env'});

const userschema=new mongoose.Schema({

        name:{
            type:String,
            //required:true,
            minlength:3

        },
        
        username:{
            type:String,
           // required:true,
            minlength:3

        },

        password:{
            type:String,
            //required:true
        },

        token:{
            type:String
        },
        
        movies:[{
            
            movie:{
                type:String,
                unique:true
            },
            review:{
                type:String
            },
            rating:{
                type:String
            }
        }
        ],

        invites:[{

        }],

        favourites:[{

            movie_name:{
                type:String
            }
        }]

    })

    //generate token
    userschema.methods.generateAuthToken = async function(){
        try{
            let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
            this.token=token;
            await this.save();
            console.log(token);
            return token;
        }
        catch(e){
            console.log(e);
        }
    }

    const users = new mongoose.model("users",userschema);

    module.exports=users;

