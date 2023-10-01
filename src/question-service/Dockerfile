FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD [ "node", "index.js" ]