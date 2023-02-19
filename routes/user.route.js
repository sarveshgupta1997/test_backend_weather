const express = require("express");
const mongoose = require("mongoose");
const {UserModel} = require("../model/user.model");
const bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
require("dotenv").config();
const {client} =  require("../config/redis")



const userRoute = express.Router();

userRoute.get("/",async(req,res)=>{
    res.send("Users Homepage")
})

userRoute.post("/register",async(req,res)=>{
    let {name, email, pass, preferredCity, recentSearches} = req.body;
    try { 
        bcrypt.hash(pass, 4, async function(err, hash) {
            if(err){                
                res.send({err})
            }else{
                let user = new UserModel({name, email, pass:hash, preferredCity, recentSearches})
                await user.save();
                res.send({msg:"User save in DB"})
            }
        });
    } catch (error) {
        res.send({err:error.message})
    }
})

userRoute.post("/login",async(req,res)=>{
    let {email, pass} = req.body;
    try { 
        let user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(pass, user.pass, async function(err, result) {
                if(result){                
                    
                    var token = jwt.sign({ userID: user._id }, process.env.secretKey);
                    res.cookie("token",token);
                    res.send({msg:"Login Sucessful",token})
                }else{
                    res.send({err:"Invalid Credentials"});
                }
            });
        }else{
            res.send({err:"Invalid Credentials"});
        }
    } catch (error) {
        res.send({err:error.message})
    }
})

userRoute.get("/logout",async(req,res)=>{
    let token = req.cookies.token;
    if(token){
        try {
            await client.LPUSH("black_token" , token);
            res.send({msg:"Logged Out (Token Blacklisted)"});
        } catch (error) {
            res.send({err:error.message})
        }
    }else{
        res.send({err:"Kindly Login First"})    
    }
})

module.exports={userRoute};