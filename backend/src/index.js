import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";

//import route files
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import groupRoutes from "./routes/group.route.js";
import groupMessageRoutes from "./routes/groupMessage.route.js"; 
dotenv.config();

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//CORS setup
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/group-messages", groupMessageRoutes);

//start server and connect to DB
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
});
