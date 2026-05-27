import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import connectDB from "./lib/db";
import cors from "cors";
import { initSocket } from "./lib/socket";
import redisClient from "./lib/redis";
import assignmentRoutes from "./routes/assignments";
import outputRoutes from "./routes/output";



const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);


app.use(express.json());
app.use(cors()); 

app.use("/api/assignments", assignmentRoutes);
app.use("/api/output", outputRoutes);


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

connectDB();


httpServer.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

export {io}