import axios from "axios";
import socketIOClient from "socket.io-client";

const basePath = "http://localhost:8001";

// HTTP requests
export const createSession = async (req) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.post(`${basePath}/api/session`, req, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const leaveSession = async (roomId, userId) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.put(`${basePath}/api/session/${roomId}/${userId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res;
};

// Websocket functions
/**
 * Sets up a socket connection to the collaboration service server.
 *
 * @param {Function} onSocketDisconnect - callback function for socket disconnect
 * @returns {Socket} socket created
 */
export const setupSocket = (onSocketDisconnect) => {
  const socket = socketIOClient(basePath);

  socket.on("connect", () => {
    console.log("socket connected");
  });

  socket.on("disconnect", () => {
    if (onSocketDisconnect) {
      onSocketDisconnect();
    }
  });

  return socket;
};

export const changeLanguage = (socket, roomId, language) => {
  socket.emit("change-language", roomId, language);
}

export const joinRoom = (socket, roomId, userId) => {
  socket.emit("join-room", roomId, userId);
};

export const sendCodeChange = (roomId, content) => {
  this.socket.emit("code-change", roomId, content);
};

export const receiveCodeUpdate = (setCurrCode) => {
  this.socket.on("code-update", (content) => {
    setCurrCode(content);
  });
};
