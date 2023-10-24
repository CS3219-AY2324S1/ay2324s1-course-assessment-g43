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

/**
 * Gets question from an existing session
 * 
 * @param {string} roomId 
 * @returns {Object} question if the session is valid, else null.
 */
export const getQuestionFromSession = async (roomId) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.get(`${basePath}/api/session/${roomId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    // Session is active if either user is still in the session
    const isSessionActive =
      res.data.firstUserStatus || res.data.secondUserStatus;

    if (!isSessionActive) {
      return null;
    }
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
    console.log(err);
    return null;
  }
}

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
