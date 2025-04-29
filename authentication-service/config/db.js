import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("MONGO_URI not found in .env file");
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Failed:", error.message);
    }
}
