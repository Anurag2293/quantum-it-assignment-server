import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(String(process.env.DATABASE_URL));
        console.log("MongoDB connected")
    } catch (error) {
        console.log("Error connecting MongoDB", (error as Error).message);
    }
}