# Use the Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the application code
COPY . .

# Expose port 5173
EXPOSE 5173

# Define the CMD
CMD ["sh", "-c", "npm run build && npm run preview;"]

# FROM node:18-alpine as BUILD_IMAGE
# WORKDIR /app/react-app

# COPY package.json .

# RUN npm install

# COPY . .

# RUN npm run build

# FROM node:18-alpine as PRODUCTION_IMAGE
# WORKDIR /app/react-app

# COPY --from=BUILD_IMAGE /app/react-app/dist/ /app/react-app/dist/
# EXPOSE 5173

# COPY package.json .
# COPY vite.config.js .

# RUN npm install

# EXPOSE 5173
# CMD [ "npm", "run", "preview" ]