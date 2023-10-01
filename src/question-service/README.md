# Questions Service

## Getting Started
### Running the server
1. Ensure the `.env` file is present in the root directory of the project.
    - The various environments are `.env.development` and `.env.production`.
    - The `.env` file should contain the following variables:
        ```
        PORT=
        DATABASE_URL=
        ```
1. Install dependencies with `npm install`.
1. Run the server with `npm run dev` during development, else use `npm run start`.

### Using Docker
Alternatively, you can use Docker to run the server. To do so, run the following commands:
```bash
# Build the docker image
docker build . -t cs3219-ay2324s1-g43/questions-service

# Run the docker image with the correct environment variable
docker run -p 3000:3000 -e PEERPREP_ENV=development cs3219-ay2324s1-g43/questions-service
```

## API documentation
The API documentation is generated using [express-jsdoc-swagger](https://www.npmjs.com/package/express-jsdoc-swagger). To view the documentation, run the server and navigate to `http://localhost:3000/api-docs/`.