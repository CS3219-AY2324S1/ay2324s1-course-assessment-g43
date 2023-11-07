
const express = require("express");
const cors = require("cors");
const expressJSDocSwagger = require("express-jsdoc-swagger");
const app = express();
const port = 5002;
 
app.use(cors());
app.use(express.json());

const options = {
  info: {
    version: "1.0.0",
    title: "PeerPrep Code Execution API",
    description: "The REST API endpoints for the PeerPrep Code Execution.",
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

const codeExecutionRouter = require("./src/routes/code-execution-routes");

app.use("/api", codeExecutionRouter);

app.listen(port, () => {
  console.log(`Code execution is running on port ${port}`);
});