const express = require("express");
const mongoose = require("mongoose");
const {UserModel} = require("../model/user.model");
const {client} =  require("../config/redis");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const cityRoute = express.Router();

cityRoute.get("/",async(req,res)=>{
    let city=req.query.city;
    const userID = req.body.userID;
    try{
        let temp;

        let cached_city_temp = await client.HGET("city_Weather_Data" ,  city);
        if(cached_city_temp){
            temp = cached_city_temp;
            // console.log("redis used")
        }else{            
            // console.log("api used")
            let result = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=3eaca349de5f83ed4a2269a5ad3106a8`);
            let data = await result.json();
            
            let result2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=3eaca349de5f83ed4a2269a5ad3106a8`);
            let out = await result2.json();
    
            temp = (out.main.temp - 273.15).toFixed(1);
    
            await client.HSET("city_Weather_Data" ,  city , temp);
        }
        
        await UserModel.findByIdAndUpdate({_id:userID},{$push: {recentSearches: city}})
        res.send({msg:`Temprature(Celsius) in ${city} is: ${temp}`})
    }
    catch(err){
        console.log(err.message)
        res.send({err:"Cannot find weather for the selected city"})
    }
})

module.exports={cityRoute};