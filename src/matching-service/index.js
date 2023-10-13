import { connect } from "amqplib";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

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
      socket.emit("fetch-question", complexity, async (question) => {
        if (!question) {
          io.to(socket.id).emit("match-failure", "No question found");
          return;
        }

        const questionString = JSON.stringify(question);

        const message = {
          uid,
          questionString,
          socketId: socket.id,
        };

        console.log("Added to Message Queue:");
        console.log(message);

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      });
    } else {
      // else pair the users up
      const firstRequest = JSON.parse(dequeuedMessage.content.toString());
      console.log("MATCHED:");
      console.log(firstRequest);

      const question = JSON.parse(firstRequest.questionString);

      io.to(firstRequest.socketId).emit("match-success", {
        uid: uid,
        ...question,
      });
      io.to(socket.id).emit("match-success", {
        uid: firstRequest.uid,
        ...question,
      });
    }
  });

  socket.on("cancel-request", async (message) => {
    const parsedMessage = JSON.parse(message);
    const { uid, complexity } = parsedMessage;
    if (!uid || !complexity) {
      console.log("Invalid request");
      console.log(`uid: ${uid}`);
      console.log(`complexity: ${complexity}`);
      // TODO: Emit different event for cancel failure (+ handle event in FE)
      io.to(socket.id).emit("match-failure", "Missing arguments");
      return;
    }

    console.log(`cancel request: (${uid}, ${complexity})`);

    const queueName = getQueue(complexity);

    // Removes the current message in the queue.
    await channel.get(queueName);
  });

  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
