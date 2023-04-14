require("dotenv").config({ path: "../../config/dev.env" });
const mongoose = require("mongoose");

/**
 * Connect to the databse, using credentials, and connection strings within the environment files.
 */
async function connect()
{
    try
    {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    } catch (error)
    {
        console.log(error);
    }
    console.log("DB Connection established.");
}

module.exports = {
    connect
};