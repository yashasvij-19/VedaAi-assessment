import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./lib/db";
import cors from "cors";
import redisClient from "./lib/redis";
import assignmentRoutes from "./routes/assignments";
import outputRoutes from "./routes/output";



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); 

app.use("/api/assignments", assignmentRoutes);
app.use("/api/output", outputRoutes);
connectDB();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});