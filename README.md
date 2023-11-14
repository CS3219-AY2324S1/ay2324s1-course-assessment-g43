# Assignment 3
>  DISCLAIMER: The following functionality and access control rules are specific only to Assignment 3. Note that certain modifications have been made to our final project.

## Functionality

The system allows registered users to interact with a question repository. The following capabilities are defined for different user roles:

- **All Users (Authenticated):** Can READ from the question repository.

#### User Roles:

1. **Admin:**
   - Designated maintainer role.
   - Able to CRUD on the question repository.

2. **Participant (Normal User):**
   - Can only READ from the question repository.

### Access Control:

#### Unauthenticated Users:

- Unable to perform CRUD operations on the question repository or any other API calls.
- Server-side: Throws a 401 error.

#### Unauthorized Users:

- **Participants:**
  - Unable to CREATE, UPDATE, or DELETE on the question repository.
  - Client-side: Deny access to the `/browse-admin` page.
  - Server-side: Throws a 403 error.


## Getting started

> Note: Our PostgreSQL database is hosted on ElephantSQL and MongoDB database is hosted on MongoDB Atlas.
> Connection to these sites are blocked by the NUS network.

### Prerequisites
- You should have Node.js and npm installed.
- Paste the contents of `Assignment3-user-service.txt` into an `.env` file in `/src/user-service`.
- Paste the contents of `Assignment3-question-service.txt` into an `.env` file in `/src/question-service`.


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