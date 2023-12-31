import axios from "axios";
import socketIOClient from "socket.io-client";

const basePath =
  import.meta.env.VITE_COLLABORATION_BASE_PATH || "http://localhost:8001";
const NAMESPACE = "/collaboration-socket";

// HTTP requests
export const createSession = async (req) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.post(`${basePath}/api/session`, req, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
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
export const getSession = async (roomId) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.get(`${basePath}/api/session/${roomId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    if (err.response.status === 404) {
      throw new Error("Session is invalid.");
    } else {
      throw new Error("Error getting session info, please try again later.");
    }
  }
};

export const updateSessionWithNewQuestion = async (roomId, question) => {
  const token = localStorage.getItem("jwt");

  const res = await axios.put(`${basePath}/api/session/${roomId}`, question, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const saveAndChangeCode = async (roomId, newLanguage, code) => {
  const token = localStorage.getItem("jwt");
  const req = {
    oldCode: code,
    newLanguage: newLanguage,
  };

  const res = await axios.put(`${basePath}/api/session/${roomId}/language`, req, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return res;
}

export const resetCode = async (roomId) => {
  const token = localStorage.getItem("jwt");
  const req = {};

  const res = await axios.put(`${basePath}/api/session/${roomId}/resetCode`, req, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return res;
}

export const deleteSession = async (roomId) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.delete(`${basePath}/api/session/${roomId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const findSessionWithUid = async (uid) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.get(`${basePath}/api/session/findWithUid/${uid}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const session = res.data;
  if (session) {
    return session.roomId;
  } else {
    return;
  }
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
 * @param {Function} receiveRequestCallback - callback function for receive change question event
 * @param {Function} changeQuestionCallback - callback function for change question event
 * @param {Function} rejectRequestCallback - callback function for reject change question event
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
  onSocketDisconnect,
  receiveRequestCallback,
  changeQuestionCallback,
  rejectRequestCallback
) => {
  const socket = socketIOClient(basePath, {
    path: NAMESPACE,
  });

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

  socket.on("initiate-next-question", () => {
    receiveRequestCallback?.();
  });

  socket.on("retrieve-next-question", () => {
    changeQuestionCallback?.();
  });

  socket.on("reject-next-question", () => {
    rejectRequestCallback?.();
  });

  socket.on("leave-room", () => {
    onLeaveRoomCallback?.();
    socket.disconnect();
  });

  socket.on("peer-connected", () => {
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

export const initiateNextQuestionRequest = (socket) => {
  socket?.emit("initiate-next-question");
};

export const rejectNextQuestionRequest = (socket) => {
  socket?.emit("reject-next-question");
};

export const acceptNextQuestionRequest = (socket) => {
  socket?.emit("retrieve-next-question");
};

export const notifyPeerLanguageChange = (socket, language) => {
  socket?.emit("change-language", language);
};

export const sendChatMessage = (socket, message) => {
  socket?.emit("new-chat-message", message);
};
