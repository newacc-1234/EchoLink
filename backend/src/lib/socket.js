import { Server } from "socket.io";
import http from "http";
import express from "express";

const app=express();
const server=http.createServer(app);

const io= new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://localhost:5174"],
    credentials: true,
  },
});
const userSocketMap = {}; 

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

//allow access to io globally (for use in controller)
export { app, server, io };

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;

    //notify all users of the online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  //join group room
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  //leave group room
  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
    console.log(`🚪 User ${userId} left group ${groupId}`);
  });

  //real-time group message
  socket.on("sendGroupMessage", ({ groupId, message }) => {
    io.to(groupId).emit("newGroupMessage", message);
  });

  //handle disconnect
  socket.on("disconnect", ()=>{
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(`User ${userId} disconnected`);
  });
});
