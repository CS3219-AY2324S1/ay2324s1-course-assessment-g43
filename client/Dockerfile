# Use the Node.js image as the base image
FROM node:18

# Set a default environment variable for PEERPREP_ENV
ARG PEERPREP_ENV=development
ENV PEERPREP_ENV=$PEERPREP_ENV

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the application code
COPY . .

# Expose port 5173
EXPOSE 5173

# Define the CMD based on the PEERPREP_ENV argument
CMD ["sh", "-c", "if [ \"$PEERPREP_ENV\" = \"production\" ]; then npm run build && npm run preview; else npm run dev; fi"]
