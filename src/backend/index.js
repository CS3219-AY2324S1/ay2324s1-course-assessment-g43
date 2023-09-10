const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const pool = require("./db.js");

const userRouter = require("./routes/user-route.js");

app.use(cors());
app.use(express.json());

//Routes
app.use("/api", userRouter);

app.get("/api/hello", (req, res) => {
    res.send("Hello world");
  });

app.listen(port, () => console.log(`Listening on port ${port}`));
