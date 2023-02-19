var jwt = require('jsonwebtoken');
require("dotenv").config();
const {client} =  require("../config/redis")

let authenticator = async (req,res,next) =>{
    // let token = req.headers.token;
    let token = req.cookies.token;
    console.log(token)
    if(token){
        try {
            const response = await client.LRANGE("black_token", 0, -1);
            if(!response.includes(token)){
                var decode = jwt.verify(token, process.env.secretKey , function(err, decoded) {
                    if(err){
                        res.send({err:"Kindly Login First"})
                    }else{
                        
                        // console.log(decoded)
                        req.body.userID=decoded.userID;
                        next();
                    }
                });
            }else{
                res.send({err:"Kindly Login Again"})
            }
        } catch (error) {
            res.send(error.message);
        }

    }else{
        res.send({err:"Kindly Login First"})
    }
}
module.exports={authenticator}