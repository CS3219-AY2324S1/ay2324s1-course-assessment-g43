require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sessionController = require("./controllers/session-controller.js");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 8001;
const databaseUrl = process.env.DATABASE_URL;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Websocket server
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    if (!roomId || !userId) return;
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });

  // Not implemented on FE yet
  // Change params if needed
  socket.on("code-change", (roomId, delta) => {
    if (!roomId || !delta) return;
    socket.to(roomId).emit("code-change", delta);
  });

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
app.put("/api/session/:roomId/:userId", sessionController.leaveSession);
app.put("/api/session/:roomId", sessionController.saveAttempt);

app.get("/api/hello", (req, res) => {
  res.send("Hello world");
});

// app.listen(port, () => console.log(`Listening on port ${port}`));
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});