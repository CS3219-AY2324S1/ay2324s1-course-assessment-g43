require("dotenv").config({ path: `.env.${process.env.PEERPREP_ENV}` });
const cors = require("cors");
const express = require("express");
const expressJSDocSwagger = require("express-jsdoc-swagger");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

const options = {
  info: {
    version: "1.0.0",
    title: "PeerPrep Questions Service API",
    description: "The REST API endpoints for the PeerPrep Questions Service.",
  },
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: "./**/*.js",
  // URL where SwaggerUI will be rendered
  swaggerUIPath: "/api-docs",
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: true,
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
};

expressJSDocSwagger(app)(options);

app.use(bodyParser.json());

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB: ", err);
});

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api", require("./src/routes/question-routes"));

app.listen(port, () => {
  console.log(`Question service listening on port ${port}`);
});
