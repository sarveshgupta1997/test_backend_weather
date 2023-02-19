let stringValidator = async (req,res,next) =>{
    let city=req.query.city;
    if(/^[a-zA-Z]+$/.test(city)){
        next();
    }else{
        res.send({err:"Enter city name only containing alphabets"})
    }
}
module.exports={stringValidator}