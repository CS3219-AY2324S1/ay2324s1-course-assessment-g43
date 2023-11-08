# Use the Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Define the CMD
CMD ["npm", "run", "start"]