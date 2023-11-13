# Assignment 2


## Functionality

- User profile management CRUD operations.
- Question repository CRUD operations.
- FE-BE integration for both.


## Getting started

> Note: Our PostgreSQL database is hosted on ElephantSQL and MongoDB database is hosted on MongoDB Atlas.
> Connection to these sites are blocked by the NUS network.


### Prerequisites
- You should have Node.js and npm installed.
- Paste the contents of `Assignment2-user-service.txt` into an `.env` file in `/src/user-service`.
- Paste the contents of `Assignment2-question-service.txt` into an `.env` file in `/src/question-service`.


### Running the app

1. Install dependencies and run the client.
  ```sh
  cd client
  npm install
  npm run dev
  ```

2. Install dependencies and run the user-service.
  ```sh
  cd src/user-service
  npm install
  node index.js
  ```

3. Install dependencies and run the question-service.
  ```sh
  cd src/question-service
  npm install
  node index.js
  ```