import mongoose from 'mongoose'
require("dotenv").config();

export const connectDB = () => {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.MONGO_DB || '');
        console.log("Mongo Connected")
    } catch (error) {
        console.log("Mongo Connected Error:" + error)
    }
}
