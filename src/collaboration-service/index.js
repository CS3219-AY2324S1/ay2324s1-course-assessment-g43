require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sessionController = require("./controllers/session-controller.js");
const http = require("http");
const { Server } = require("socket.io");
const { WebSocketServer } = require("ws");
const setupWSConnection = require("y-websocket/bin/utils").setupWSConnection;

const app = express();
const port = process.env.PORT || 8001;
const wssPort = 8002;
const databaseUrl = process.env.DATABASE_URL;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// socket IDs to room IDs mapping
const socketRooms = new Map();

function addSocketToRoom(socket, roomId) {
  socketRooms.set(socket.id, roomId);
}

function removeSocketFromRoom(socket) {
  socketRooms.delete(socket.id);
}

function getRoomOfSocket(socket) {
  return socketRooms.get(socket.id);
}

// Socket.io server
io.on("connection", (socket) => {
  // Custom Events
  socket.on("join-room", (roomId, userId) => {
    if (!roomId || !userId) return;
    addSocketToRoom(socket, roomId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });

  socket.on("change-language", (language) => {
    if (!language) return;
    const roomId = getRoomOfSocket(socket);
    socket.to(roomId).emit("change-language", language);
  });

  socket.on("leave-room", () => {
    const roomId = getRoomOfSocket(socket);
    socket.to(roomId).emit("leave-room");
  });

  socket.on("new-chat-message", (message) => {
    // Message is a JS object.
    if (!message) return;
    const roomId = getRoomOfSocket(socket);
    socket.to(roomId).emit("new-chat-message", message);
  });

  socket.on("disconnect", () => {
    const roomId = getRoomOfSocket(socket);
    socket.to(roomId).emit("user-disconnected", socket.id);
    removeSocketFromRoom(socket);
  });
});

app.use(cors());
app.use(bodyParser.json());

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB session service!");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB: ", err);
});

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/api/session", sessionController.createSession);
app.get("/api/session/:roomId", sessionController.getSession);
app.put("/api/session/:roomId", sessionController.saveAttempt);
app.delete("/api/session/:roomId", sessionController.deleteSession);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
server.on("error", console.error);

// https://dev.to/akormous/building-a-shared-code-editor-using-nodejs-websocket-and-crdt-4l0f
/**
 * Create a wss (Web Socket Secure) server
 */
const wss = new WebSocketServer({ port: wssPort });

/**
 * On connection, use the utility file provided by y-websocket
 */
wss.on("connection", (ws, req) => {
  console.log("wss:connection");
  setupWSConnection(ws, req);
});