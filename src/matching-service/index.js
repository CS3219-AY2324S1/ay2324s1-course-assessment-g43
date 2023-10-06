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

await channel.assertQueue(EASY_QUEUE, { durable: false, messageTtl: 30000 });
await channel.assertQueue(MEDIUM_QUEUE, { durable: false, messageTtl: 30000 });
await channel.assertQueue(HARD_QUEUE, { durable: false, messageTtl: 30000 });

const getQueue = (difficulty) => {
  switch (difficulty) {
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

  socket.on("match-request", async (uid, difficulty) => {
    if (!uid || !difficulty) {
      console.log("Invalid request");
      io.to(socket.id).emit("match-failure", "Missing arguments");
      return;
    }

    console.log(`match-request: (${uid}, ${difficulty})`);

    const queueName = getQueue(difficulty);

    // polls the queue
    const dequeuedMessage = await channel.get(queueName);

    // if there is no users in the queue, add the user to the queue
    if (!dequeuedMessage) {
      const qid = await getQuestionId(difficulty);
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
      const otherUser = JSON.parse(dequeuedMessage.content.toString());
      console.log("MATCHED:");
      console.log(otherUser);

      io.to([otherUser.socketId, socket.id]).emit("match-success", {
        uid: otherUser.uid,
        qid: otherUser.qid,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
