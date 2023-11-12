# Use the Node.js image as the base image
FROM node:18

# Set a default environment variable for PEERPREP_ENV
ARG PEERPREP_ENV
ENV PEERPREP_ENV ${PEERPREP_ENV:-production}

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the application code
COPY . .

# Expose port 8001 and 8002
EXPOSE 8001
EXPOSE 8002

# Define the CMD
CMD ["sh", "-c", "if [ \"$PEERPREP_ENV\" = \"production\" ]; then npm run start; else npm run dev; fi"]