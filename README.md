# Assignment 4 Instructions

This file contains instructions on how to build and run the question microservice application as well as the user microservice application. Do follow the instructions strictly to ensure that the applications are started successfully.

We will be using Docker to containerise our applications.

To briefly walk you through what would be done, we will be:

1. Navigating into the relevant application folders
2. Building the individual Docker images
3. Running the individual Docker containers
4. Creating a network on Docker and connecting the containers to the network
5. Testing to see if our applications are successfully containerised

# Ensure you have the right env files

Paste the contents of `Assignment4-user-service.txt` into an `.env.docker` file in `src/user-service`
Paste the contents of `Assignment4-question-service.txt` into an `.env.docker` file in `src/question-service`

# Download Docker

If you don't already have Docker installed, [download](https://www.docker.com/products/docker-desktop/) the right version of Docker corresponding to the machine you are using and complete the Docker installation.

# Run Docker Desktop

After you have successfully downloaded and installed Docker, run the Docker Desktop application.

# 1. Navigate into the application folder

Assuming that you have just pulled from our master branch and you are currently in our project folder in Terminal, navigate to the folder containing the user service application by doing

```
cd src/user-service
```

# 2. Build the Docker image

Now, build the docker image for user service by running

```
docker build -t user-service .
```

# 3. Run the Docker container

Run the Docker container called `user-service` using the image that you created in the previous step.

```
docker run -p 8000:8000 -e PEERPREP_ENV=docker --name user-service user-service
```

> Note:
> Please make sure to pass in the `PEERPREP_ENV=docker` argument when running this function. This argument determines which environment file to use.

# Repeat for other application

Repeat Steps 1 to 3 for the question service. The question service application folder is in the `src` folder and you can switch to that folder by running:

```
cd ../question-service
```

After switching to that folder, you can run the same commands in Steps 1 to 3 but **replace all occurrences of `user-service` with `question-service`**. Also, question service used port 3000, so change `8000:8000` to `3000:3000`. It should look something like this to run the Docker container

```
docker run -p 3000:3000 -e PEERPREP_ENV=docker --name question-service question-service
```

# 4. Create a Docker network

Now we will create a Docker network so that the applications can communicate with one another for the automatic DNS resolution feature provided by user-defined bridges.

Run:

```
docker network create peerprep-network
```

# 5. Connect the containers to the network

To connect the containers to the network, run

```
docker network connect peerprep-network user-service
docker network connect peerprep-network question-service
```

Up to this point, if you have managed to run all these commands without errors, you have successfully build, run and connected the 2 applications. Time to move on to testing these applications!

# Testing via Shell access

If you have third party applications like Postman, you can test using those applications as well by doing a `GET` request to `/api/hello` for both endpoints. They should return a `"Hello world"` string in response.

But if you don't have those third party applications installed, fret not, we got you covered. In your terminal, run:

```
docker exec -it <container_name> /bin/bash
```

Replace `<container_name>` with the either `user-service` or `question-service`.
That command basically allows you to access the Shell of that application.
Run the command bellow to make a request to the path `/api/hello` which prints `Hello world` to your terminal.

```
curl http://localhost:<port_number>/api/hello
```

Replace `<port_number>` with `8000` if you are in `user-service` or `3000` if you are in `question-service`.
