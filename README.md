# ASSIGNMENT-5 Instructions
This file contains instructions on how to build and run the question microservice application as well as the user microservice application. Do follow the instructions strictly to ensure that the applications are started successfully.

We will be using Docker to containerise our applications.

To briefly walk you through what would be done, we will be:

1. Navigating into the relevant application folders
2. Building the individual Docker images
3. Running the individual Docker containers
4. Creating a network on Docker and connecting the containers to the network
5. Testing to see if our applications are successfully containerised

# Download Docker

If you don't already have Docker installed, [download](https://www.docker.com/products/docker-desktop/) the right version of Docker corresponding to the machine you are using and complete the Docker installation.

# Run Docker Desktop

After you have successfully downloaded and installed Docker, run the Docker Desktop application.

## Using Docker

Ensure you have all the right ENV files in the right folders

Open Docker and after the Docker Engine is up and running, from the `ay2324s1-course-assessment-g43` folder, run `docker compose up`. You should see all the microservices running in their individual containers on the Docker Desktop and you are good to go!

## Using NPM

Do the same checks for the URLs mentioned above. This time, everything supposed to be set to using localhost.

Run `npm i concurrently` if you don't have Concurrently installed.

Run `npm run install-all` which will run `npm i` in each individual microservice.

Run `npm run dev-all` which will run `npm run dev` in each individual microservice.

That's it! Happy coding!