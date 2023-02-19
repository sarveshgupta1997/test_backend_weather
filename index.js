const express = require("express");
const {connection} = require("./config/db");
const {userRoute} = require("./routes/user.route")
const {cityRoute} = require("./routes/city.route")
const {authenticator} = require("./middlewares/authenticator")
const {stringValidator} = require("./middlewares/stringValidator")
var cors = require('cors')
require("dotenv").config();
var cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/users",userRoute)
app.use(authenticator)
app.use(stringValidator)
app.use("/city",cityRoute)

app.get("/",(req,res)=>{
    res.send("Wether Homepage")
})

app.listen(process.env.port, async()=>{
    try {
        await connection;
        console.log("Connecterd to db");
    } catch (error) {
        console.log(error.message);
    }
    console.log("Server running on port"+process.env.port)
})