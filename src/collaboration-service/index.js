require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
const port = process.env.PORT || 8001;
const databaseUrl = process.env.DATABASE_URL;

const sessionController = require("./controllers/session-controller.js");

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

app.listen(port, () => console.log(`Listening on port ${port}`));