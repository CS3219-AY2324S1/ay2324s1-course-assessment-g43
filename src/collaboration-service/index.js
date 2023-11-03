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

// Socket.io server
io.on("connection", (socket) => {
  // Custom Events
  socket.on("join-room", (roomId, userId) => {
    if (!roomId || !userId) return;
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });

  socket.on("change-language", (language) => {
    if (!language) return;
    socket.broadcast.emit("change-language", language);
  });

  socket.on("initiate-next-question", () => {
    socket.broadcast.emit("initiate-next-question");
  })

  socket.on("retrieve-next-question", () => {
    socket.broadcast.emit("retrieve-next-question");
  })

  socket.on("leave-room", () => {
    socket.broadcast.emit("leave-room");
  });

  // Not in use by FE presently
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected");
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
app.put("/api/session/:roomId", sessionController.editSession);
app.delete("/api/session/:roomId", sessionController.deleteSession);


app.get("/api/hello", (req, res) => {
  res.send("Hello world");
});

// app.listen(port, () => console.log(`Listening on port ${port}`));
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