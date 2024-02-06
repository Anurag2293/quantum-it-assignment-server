import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors"
import { connectDB } from "./db/mongoose";
import UserRouter from "./routes/user";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(express.json())
app.use(cors())

app.use("/user", UserRouter);
app.get("/health-check", (req, res) => {
    res.send("Server is running!");
});

app.listen(port, () => {
    console.log("Server is running on port 3000");
});