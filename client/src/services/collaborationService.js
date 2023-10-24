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
 * Initialises a socket connection to the collaboration service server.
 * - Joins a room.
 * - Set up custom event listeners.
 *
 * @param {Function} onPeerLanguageChange - callback function for peer language change event
 * @param {Function} onSocketDisconnect - callback function for socket disconnect
 * @returns {Socket} socket created
 */
export const initCollaborationSocket = (
  roomId,
  userId,
  onPeerLanguageChange,
  onSocketDisconnect
) => {
  const socket = socketIOClient(basePath);

  socket.on("connect", () => {
    console.log("Collab Service socket connected");
    socket.emit("join-room", roomId, userId);
  });

  socket.on("disconnect", () => {
    if (onSocketDisconnect) {
      onSocketDisconnect();
    }
  });

  // Custom events
  socket.on("change-language", (language) => {
    if (onPeerLanguageChange) {
      onPeerLanguageChange(language);
    }
  });

  return socket;
};

export const notifyPeerLanguageChange = (socket, roomId, language) => {
  socket?.emit("change-language", roomId, language);
};
