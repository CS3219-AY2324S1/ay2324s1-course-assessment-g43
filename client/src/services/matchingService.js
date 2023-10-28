import socketIOClient from "socket.io-client";
import { getRandomQuestionByComplexity } from "../services/questionService";
import { createSession} from "./collaborationService";

const ENDPOINT = "http://localhost:5001";

/**
 * Sets up a socket connection to the matching service server.
 *
 * @param {Function} onMatchSuccess - callback function for successful match
 * @param {Function} onMatchFailure - callback function for failed match
 * @param {Function} onSocketDisconnect - callback function for socket disconnect
 * @returns {Socket} socket created
 */
const setupSocket = (onMatchSuccess, onMatchFailure, onSocketDisconnect) => {
  const socket = socketIOClient(ENDPOINT);

  socket.on("connect", () => {
    console.log("socket connected");
  });

  socket.on("disconnect", () => {
    if (onSocketDisconnect) {
      onSocketDisconnect();
    }
  });

  // Custom events
  socket.on("match-success", (successMsg) => {
    if (onMatchSuccess) {
      onMatchSuccess(successMsg);
    }
  });

  socket.on("match-failure", (errorMsg) => {
    if (onMatchFailure) {
      onMatchFailure(errorMsg);
    }
  });

  socket.on("create-session", async (sessionCreationRequest, callback) => {

    const { roomId, firstUserId, secondUserId, complexity } = sessionCreationRequest;

    const question = await getRandomQuestionByComplexity(complexity);

    const sessionDetails = {
      roomId,
      firstUserId,
      secondUserId,
      ...question,
    };

    const session = await createSession(sessionDetails);

    console.log("session")
    console.log(session)
    
    callback(session?.data);
  })

  return socket;
};

export default setupSocket;
