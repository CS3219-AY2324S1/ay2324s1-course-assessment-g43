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
    if (err.response.status === 404) {
      throw new Error("Session is invalid.");
    } else {
      throw new Error("Error getting session info, please try again later.");
    }
  }
};

export const deleteSession = async (roomId) => {
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
 * This socket is used for both collaboration (code editor) and communication (chat).
 * - Joins a room.
 * - Set up custom event listeners.
 *
 * @param {string} roomId
 * @param {string} userId
 * @param {Function} onPeerLanguageChange - callback function for peer language change event
 * @param {Function} onLeaveRoomCallback - callback function for peer closing the room
 * @param {Function} onChatMessageReceived - callback function for peer sending a chat message
 * @param {Function} onPeerJoined - callback function for peer joined
 * @param {Function} onPeerDisconnected - callback function for peer disconnect
 * @param {Function} onSocketDisconnect - callback function for socket disconnect
 * @returns {Socket} socket created
 */
export const initCollaborationSocket = (
  roomId,
  userId,
  onPeerLanguageChange,
  onLeaveRoomCallback,
  onChatMessageReceived,
  onPeerJoined,
  onPeerDisconnected,
  onSocketDisconnect
) => {
  const socket = socketIOClient(basePath);

  socket.on("connect", () => {
    console.log("Collab Service socket connected");
    socket.emit("join-room", roomId, userId);
  });

  socket.on("disconnect", () => {
    onSocketDisconnect?.();
  });

  // Custom events
  socket.on("change-language", (language) => {
    onPeerLanguageChange?.(language);
  });

  socket.on("new-chat-message", (message) => {
    onChatMessageReceived?.(message);
  });

  socket.on("leave-room", () => {
    onLeaveRoomCallback();
    socket.disconnect();
  });

  socket.on("user-connected", () => {
    onPeerJoined?.();
  });

  socket.on("user-disconnected", () => {
    onPeerDisconnected?.();
  });

  return socket;
};

export const initiateLeaveRoomRequest = (socket) => {
  socket?.emit("leave-room");
};


export const notifyPeerLanguageChange = (socket, language) => {
  socket?.emit("change-language", language);
};

export const sendChatMessage = (socket, message) => {
  socket?.emit("new-chat-message", message);
};