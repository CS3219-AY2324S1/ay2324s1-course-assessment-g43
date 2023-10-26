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
    return null;
  }
};

/**
 * Gets question from an existing session
 *
 * @param {string} roomId
 * @returns {Object} question if the session is valid, else throws Error.
 */
export const getQuestionFromSession = async (roomId) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.get(`${basePath}/api/session/${roomId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    // Convert Session to Question
    const question = {
      questionId: res.data.questionId,
      title: res.data.title,
      description: res.data.description,
      category: res.data.category,
      complexity: res.data.complexity,
    };
    return question;
  } catch (err) {
    if (err.status === 404) {
      throw new Error("Session is invalid.");
    } else {
      throw new Error("Error getting session info, please try again later.");
    }
  }
};

export const leaveSession = async (roomId) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.delete(`${basePath}/api/session/${roomId}`, {
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
  onLeaveRoomCallback,
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

  socket.on("leave-room", () => {
    onLeaveRoomCallback();
    socket.disconnect();
  });

  return socket;
};

export const initiateLeaveRoomRequest = (socket) => {
  socket?.emit("leave-room");
};


export const notifyPeerLanguageChange = (socket, language) => {
  socket?.emit("change-language", language);
};
