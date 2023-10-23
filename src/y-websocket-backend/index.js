import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

/**
 * Server INITIALIZATION and CONFIGURATION
 * CORS configuration
 * Request body parsing
 */
const app = express();
app.use(cors());
app.use(express.json());


/**
 * Create an http server
 */
export const httpServer = createServer(app);

/**
 * Create a wss (Web Socket Secure) server
 */
export const wss = new WebSocketServer({server: httpServer})

function onError(error) {

}

function onListening() {

}

httpServer.on('error', onError);
httpServer.on('listening', onListening);

/**
* On connection, use the utility file provided by y-websocket
*/
wss.on('connection', (ws, req) => {
  console.log("New connection");

  setupWSConnection(ws, req);
})

const port = 1234;
const host = 'localhost';

httpServer.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`)
})