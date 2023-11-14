const { connect } = require("amqplib");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const {
  EASY_QUEUE,
  MEDIUM_QUEUE,
  HARD_QUEUE,
  TIMEOUT_MS,
} = require("./constants.js");
const { getQueue, listenToQueue, listenToReplies } = require("./matching.js");

dotenv.config({ path: `.env.${process.env.PEERPREP_ENV}` });

const app = express();
const port = process.env.PORT || 5001;

const init = async () => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    path: "/matching-service",
  });

  app.use(cors());
  app.use(express.json());

  app.get("/api/hello", (req, res) => {
    res.send("Hello world");
  });

  const ampqHost = process.env.AMPQ_HOST;

  const connection = await connect(ampqHost);

  const channel = await connection.createChannel();

  await channel.assertQueue(EASY_QUEUE, { durable: false, messageTtl: 30000 });
  await channel.assertQueue(MEDIUM_QUEUE, {
    durable: false,
    messageTtl: 30000,
  });
  await channel.assertQueue(HARD_QUEUE, { durable: false, messageTtl: 30000 });

  io.on("connection", (socket) => {
    console.log(`Connection opened: ${socket.id}`);
    const timeoutId = setTimeout(() => {
      socket.disconnect(true);
    }, TIMEOUT_MS);

    socket.on("match-request", async (message) => {
      console.log("Received match request");

      const parsedMessage = JSON.parse(message);

      const { uid, name, complexity } = parsedMessage;

      if (!uid || !name || !complexity) {
        io.to(socket.id).emit("match-failure", "Missing arguments");
        return;
      }

      const queueName = getQueue(complexity);

      if (!queueName) {
        io.to(socket.id).emit("match-failure", "Invalid arguments");
        return;
      }

      const messageMatchRequest = {
        isCancelRequest: false,
        userId: uid,
        userName: name,
        socketId: socket.id,
      };

      console.log("send request message to queue");

      channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(messageMatchRequest))
      );
    });

    socket.on("cancel-request", async (message) => {
      const parsedMessage = JSON.parse(message);

      const { uid, name, complexity } = parsedMessage;
      if (!uid || !name || !complexity) {
        io.to(socket.id).emit("match-failure", "Missing arguments");
        return;
      }

      const queueName = getQueue(complexity);

      if (!queueName) {
        io.to(socket.id).emit("match-failure", "Invalid arguments");
        return;
      }

      const messageCancelRequest = {
        isCancelRequest: true,
        userId: uid,
        userName: name,
        socketId: socket.id,
      };

      channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(messageCancelRequest))
      );
    });

    socket.on("disconnect", () => {
      clearTimeout(timeoutId);
      console.log("User has left");
    });
  });

  // Matcher listens to the queues, pairs requests and sends matched pairs to the MATCH_REPLY_QUEUE
  listenToQueue(channel);

  // Server listens to the MATCH_REPLY_QUEUE and sends the matched pairs to the clients
  listenToReplies(channel, io);

  server.listen(port, () => {
    console.log(`Environment: ${process.env.PEERPREP_ENV}`);
    console.log(`listening on port ${port}`);
  });
};

init();
