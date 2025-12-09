import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import pollRoutes from "./routes/pollRoutes.js"

dotenv.config();
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);  

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.listen(5000, () => console.log("Server running on port 5000"));