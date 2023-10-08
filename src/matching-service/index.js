import { connect } from "amqplib";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import getQuestionId from "./src/question-id-service.js";

dotenv.config();

const app = express();
const port = 5001;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.send("Hello world");
});

const ampqHost = process.env.AMPQ_HOST;

const connection = await connect(ampqHost);

const channel = await connection.createChannel();

const EASY_QUEUE = "easy-queue";
const MEDIUM_QUEUE = "medium-queue";
const HARD_QUEUE = "hard-queue";

const TIMEOUT_MS = 35 * 1000;

await channel.assertQueue(EASY_QUEUE, { durable: false, messageTtl: 30000 });
await channel.assertQueue(MEDIUM_QUEUE, { durable: false, messageTtl: 30000 });
await channel.assertQueue(HARD_QUEUE, { durable: false, messageTtl: 30000 });

const getQueue = (complexity) => {
  switch (complexity) {
    case "Easy":
      return EASY_QUEUE;
    case "Medium":
      return MEDIUM_QUEUE;
    case "Hard":
      return HARD_QUEUE;
    default:
      return null;
  }
};

io.on("connection", (socket) => {
  console.log(`Connection opened: ${socket.id}`);
  const timeoutId = setTimeout(() => {
    io.to(socket.id).emit("match-failure", "Timeout");
    socket.disconnect(true);
    console.log("Socket disconnected due to timeout");
  }, TIMEOUT_MS);

  socket.on("match-request", async (message) => {
    const parsedMessage = JSON.parse(message);
    const { uid, complexity } = parsedMessage;
    if (!uid || !complexity) {
      console.log("Invalid request");
      console.log(`uid: ${uid}`);
      console.log(`complexity: ${complexity}`);
      io.to(socket.id).emit("match-failure", "Missing arguments");
      return;
    }

    console.log(`match-request: (${uid}, ${complexity})`);

    const queueName = getQueue(complexity);

    // polls the queue
    const dequeuedMessage = await channel.get(queueName);

    // if there is no users in the queue, add the user to the queue
    if (!dequeuedMessage) {
      const qid = await getQuestionId(complexity);
      if (!qid) {
        io.to(socket.id).emit("match-failure", "No question found");
        return;
      }

      const message = {
        uid,
        qid,
        socketId: socket.id,
      };

      console.log("Added to Message Queue:");
      console.log(message);

      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    } else {
      // else pair the users up
      const firstUser = JSON.parse(dequeuedMessage.content.toString());
      console.log("MATCHED:");
      console.log(firstUser);

      io.to(firstUser.socketId).emit("match-success", {
        uid: uid,
        qid: firstUser.qid,
      });
      io.to(socket.id).emit("match-success", {
        uid: firstUser.uid,
        qid: firstUser.qid,
      });
    }
  });

  socket.on("disconnect", () => {
    clearTimeout(timeoutId);
    console.log("User has left");
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
