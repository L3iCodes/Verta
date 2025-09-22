import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';

import { connectDB } from './lib/db.js'
import { app, server } from "./lib/socket.js";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
dotenv.config();

const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;

server.listen(PORT, () => {
    console.log('Server is running on PORT:' + PORT);
    connectDB();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ORIGIN || 'http://localhost:5173',
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);