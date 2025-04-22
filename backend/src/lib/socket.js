import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// ? create a socket server:-
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // * allowed origins
  },
});

// ? helper function:-
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// ? use to store online users:-
const userSocketMap = {}; // * { userId: socketId }

// ? incoming listening connection:-
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // ? io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ? socket.on() is used to listen to events from a specific client
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
