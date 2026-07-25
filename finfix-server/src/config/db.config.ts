import "dotenv/config";
import mongoose from "mongoose";

const DB_URL = process.env.MONGO_URI || "mongodb://localhost:27017/finfix";

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;