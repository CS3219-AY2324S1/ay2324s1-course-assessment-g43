# User Service

## Getting Started
1. Ensure the `.env` file is present in the root directory of the project. The .env file should contain the following variables:
    ```
    PSQL_HOST=
    PSQL_PASSWORD=
    PSQL_USER=
    PSQL_DATABASE=
    ```
2. Install dependencies with `npm install`.
3. Run the server with `node index.js`.

## API documentation
The API documentation is generated using [express-jsdoc-swagger](https://www.npmjs.com/package/express-jsdoc-swagger). To view the documentation, run the server and navigate to `http://localhost:5000/api-docs/`.