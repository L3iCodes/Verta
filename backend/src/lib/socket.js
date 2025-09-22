import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv"
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN,
        methods: ["GET", "POST", "PUT"],
        credentials: true
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
};

// Store online users
const userSocketMap = {} //{userId: socketId}

io.on("connection", (socket) => {
    // get userId sent by the client
    const userId = socket.handshake.query.userId
    if(userId) userSocketMap[userId] = socket.id;

    // io.emit() - uses to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //send back an array of keys (userId)

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});

export { io, app, server }