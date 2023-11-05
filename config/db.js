require("dotenv").config();
const mongoose = require("mongoose");

function connectDb(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL)
        .then(()=>{
            console.log("MongoDB Connected")
        })
        .catch(error=>{
            console.log("Connection not establish", error);
        })
}

module.exports = connectDb;