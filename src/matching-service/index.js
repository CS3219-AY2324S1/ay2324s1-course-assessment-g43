import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { connect } from 'amqplib';

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

const connection = await connect('amqps://wevlszxo:vOvIm593u8ZTXxF3RkPlSHTLjojDF6LH@armadillo.rmq.cloudamqp.com/wevlszxo');

const channel = await connection.createChannel();

const EASY_QUEUE = 'easy-queue';
const MEDIUM_QUEUE = 'medium-queue';
const HARD_QUEUE = 'hard-queue';

await channel.assertQueue(EASY_QUEUE, { durable: false, messageTtl: 30000 });
await channel.assertQueue(MEDIUM_QUEUE, { durable: false, messageTtl: 30000 });
await channel.assertQueue(HARD_QUEUE, { durable: false, messageTtl: 30000 });

const getQueue = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return EASY_QUEUE;
    case 'medium':
      return MEDIUM_QUEUE;
    case 'hard':
      return HARD_QUEUE;
    default:
      return null;
  }
}

io.on("connection", (socket) => {
  console.log("We have a new connection");

  socket.on("new-match", async (uid, difficulty) => {
    console.log("new match uid " + uid);
    console.log("new match difficulty " + difficulty);

    const queueName = getQueue(difficulty);

    // polls the queue
    const msg = await channel.get(queueName);
    
    // if there is no users in the queue, add the user to the queue
    if (msg == false) {
      const qid = Math.floor(Math.random() * 100); // Gets a random question
      const message = {
        uid,
        qid,
        socketId: socket.id,
      };

      console.log("added message into queue" + JSON.stringify(message));
      
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), );
    } else {
      // else pair the users up
      const { uid, qid, socketId } = JSON.parse(msg.content.toString());

      console.log("found a match uid: " + uid + " qid: " + qid + " socketId: " + socketId);

      io.to([socketId, socket.id]).emit("match-success", [uid, qid]);

    }
  });

  socket.on("disconnect", () => {
    console.log("User has left");
  });
});


server.listen(5001, () => {
  console.log("listening on port 5001");
});