// import { connect } from "amqplib";
// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import { EASY_QUEUE, MEDIUM_QUEUE, HARD_QUEUE, TIMEOUT_MS } from "./constants.js";
// import { getQueue, listenToQueue } from "./matching.js";

const { connect } = require("amqplib");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { EASY_QUEUE, MEDIUM_QUEUE, HARD_QUEUE, TIMEOUT_MS } = require("./constants.js");
const { getQueue, listenToQueue, listenToReplies } = require("./matching.js");

dotenv.config();

const app = express();
const port = 5001;

const init = async () => {

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
  
  await channel.assertQueue(EASY_QUEUE, { durable: false, messageTtl: 30000 });
  await channel.assertQueue(MEDIUM_QUEUE, { durable: false, messageTtl: 30000 });
  await channel.assertQueue(HARD_QUEUE, { durable: false, messageTtl: 30000 });
  
  io.on("connection", (socket) => {
    console.log(`Connection opened: ${socket.id}`);
    const timeoutId = setTimeout(() => {
      socket.disconnect(true);
    }, TIMEOUT_MS);
  
    socket.on("match-request", async (message) => {
      const parsedMessage = JSON.parse(message);
      const { uid, complexity } = parsedMessage;
      if (!uid || !complexity) {
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
        socketId: socket.id,
      }
  
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messageMatchRequest)));
    });
  
    socket.on("cancel-request", async (message) => {
      const parsedMessage = JSON.parse(message);
      const { uid, complexity } = parsedMessage;
      if (!uid || !complexity) {
        // TODO: Emit different event for cancel failure (+ handle event in FE)
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
        socketId: socket.id,
      }
  
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messageCancelRequest)));
    });
  
    socket.on("disconnect", () => {
      clearTimeout(timeoutId);
      console.log("User has left");
    });
  });

  listenToQueue(channel);
  listenToReplies(channel, io);

  server.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

init();

