# Use the Node.js image as the base image
FROM node:18

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
CMD ["npm", "run", "start"]