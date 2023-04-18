require("dotenv").config({ path: "../../config/dev.env" });
const mongoose = require("mongoose");

module.exports =
{
    /**
     * Connect to the database, using credentials, and connection strings within the environment files.
     */
    connect: async function()
    {
        try
        {
            await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
            console.log("DB Connection established.");
        }
        catch (error)
        {
            console.log(error);
        }
    }
};
