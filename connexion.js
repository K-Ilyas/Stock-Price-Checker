const {MongoClient} = require("mongodb");
const mongoose = require("mongoose"); 
const Stock = require("./models/Stock");
require("dotenv").config();


async function main(callback) {
    // const URI = process.env.MONGO_URI;
    const URI = process.env.DB;
    try {
        // await client.connect();
        // Make the appropriate DB calls
        const mongooseClinet =  await mongoose.connect(URI);
        const StockModel = await Stock(mongooseClinet);
        await callback(mongooseClinet,StockModel);

        

        console.log("Connect to the Database");
    }
    catch (e) {
        //cathc any errors
        console.log(e);
        throw new Error("Unable to Connect to the Database");
    }
}

module.exports = main;