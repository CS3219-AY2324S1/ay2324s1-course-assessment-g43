# ASSIGNMENT-5 Instructions
This file contains instructions on how to build and run all microservices, as well as the client. Do follow the instructions strictly to ensure that the applications are started successfully.

We will be using Docker to containerise our applications.

### Download Docker

If you don't already have Docker installed, [download](https://www.docker.com/products/docker-desktop/) the right version of Docker corresponding to the machine you are using and complete the Docker installation.

### Run Docker Desktop

After you have successfully downloaded and installed Docker, run the Docker Desktop application.

## Instructions to start local development environment

Before running the application in any environment, please follow the steps mentioned below to set up our application on your machine of choice. You will need accounts with ElephantSQL, MongoDB, CloudAMPQ, and RapidAPI to set up our project locally.

### 1. Ensure that your environement variables are correct

#### Client

- Inside the `./client` folder, create a file called .env which contains the following variables (make sure you add the . in front of “env”)
```
VITE_USER_BASE_PATH=http://localhost:8000/api
VITE_QUESTION_BASE_PATH=http://localhost:3000/api/questions
VITE_MATCHING_ENDPOINT=http://localhost:5001
VITE_HISTORY_BASE_PATH=http://localhost:3001/api
VITE_CODE_EXECUTION_BASE_PATH=http://localhost:5002/api
VITE_COLLABORATION_BASE_PATH=http://localhost:8001
VITE_COLLABORATION_WS_ORIGIN=ws://localhost:8002
```

#### User Service
In the `./src/user-service folder`, create 2 files called

-  `.env.local` which contain the following variables
```
PORT=8000
PSQL_HOST=rain.db.elephantsql.com
PSQL_PASSWORD=<Elephant SQL account password>
PSQL_USER=<Elephant SQL account>
PSQL_DATABASE=<Elephant SQL database name>
ACCESS_TOKEN_SECRET=<your own access token secret>
```

-  `.env.docker` which contain the following variables
```
PORT=8000
PSQL_HOST=rain.db.elephantsql.com
PSQL_PASSWORD=<Elephant SQL account password>
PSQL_USER=<Elephant SQL account>
PSQL_DATABASE=<Elephant SQL database name>
ACCESS_TOKEN_SECRET=<your own access token secret>
```

#### Questions Service

In the `./src/question-service` folder, create 2 files called

- `.env.local` which contain the following variables
```
PORT=3000
QUESTION_DATABASE_URL=<A MongoDB URL>
USER_BASE_PATH=http://localhost:8000/api
```

- `.env.docker` which contains the following variables
```
PORT=3000
QUESTION_DATABASE_URL=<A MongoDB URL>
USER_BASE_PATH=http://user-service:8000/api
```

#### Matching Service
In the `./src/matching-service` folder, create 2 files called

- `.env.local` which contain the following variables
```
PORT=5001
AMPQ_HOST=<A CloudAMPQ instance URL>
```

- `.env.docker` which contains the following variables
```
PORT=5001
AMPQ_HOST=<A CloudAMPQ instance URL>
```

#### Collaboration Service

In the `./src/collaboration-service` folder, create 2 files called

- `.env.local` which contain the following variables
```
PORT=8001
COLLABORATION_DATABASE_URL=<A MongoDB URL>
USER_BASE_PATH=http://localhost:8000/api
```

- `.env.docker` which contains the following variables
```
PORT=8001
COLLABORATION_DATABASE_URL=<A MongoDB URL>
USER_BASE_PATH=http://user-service:8000/api
```

#### History Service

In the `./src/history-service` folder, create 2 files called

- `.env.local` which contains the following variables
```
PORT=3001
HISTORY_DATABASE_URL=<A MongoDB URL>
USER_BASE_PATH=http://localhost:8000/api
```
- `.env.docker` which contains the following variables
```
PORT=3001
HISTORY_DATABASE_URL=<A MongoDB URL>
USER_BASE_PATH=http://user-service:8000/api
```

#### Code Execution Service

In the `./src/code-execution-service` folder, create 2 files called

- `.env.local` which contain the following variables
```
REACT_APP_RAPID_API_HOST="judge0-ce.p.rapidapi.com"
REACT_APP_RAPID_API_KEY=<Rapid API Key> // TODO
REACT_APP_RAPID_API_URL="https://judge0-ce.p.rapidapi.com"
USER_BASE_PATH=http://localhost:8000/api
```
- `.env.docker` which contain the following variables
```
REACT_APP_RAPID_API_HOST="judge0-ce.p.rapidapi.com"
REACT_APP_RAPID_API_KEY=<Rapid API Key>
REACT_APP_RAPID_API_URL="https://judge0-ce.p.rapidapi.com"
USER_BASE_PATH=http://user-service:8000/api
```

### 2. Starting the application

#### Using Docker

1. Open Docker and ensure that the Docker Engine is up and running. 

2. Ensure that you are in the root folder of our application.

3. Run the commands below depending on your OS. You should see all the microservices running in their individual containers on the Docker Desktop and you are good to go!

    - Windows (Powershell): `$env:PEERPREP_ENV="docker"; docker compose up`.

    - Unix: `PEERPREP_ENV=docker docker compose up`

#### Using NPM

Do the same checks for the URLs mentioned above. This time, everything supposed to be set to using localhost.

1. Ensure that you are in the root folder of our application.

2. Run `npm i concurrently` if you don't have Concurrently installed.

3. Run `npm run install-all` which will run `npm i` in each individual microservice.

4. Run the commands below depending on your OS, which will run `npm run dev` in each individual microservice.

    - Windows (Powershell): `$env:PEERPREP_ENV="local"; npm run dev-all`.

    - Unix: `PEERPREP_ENV=local; npm run dev-all`

That's it! Happy coding!