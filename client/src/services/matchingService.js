import socketIOClient from "socket.io-client";
import { getRandomQuestionByComplexity } from "../services/questionService";
import { createSession } from "./collaborationService";

const ENDPOINT =
  import.meta.env.VITE_MATCHING_ENDPOINT || "http://localhost:5001/";

/**
 * Sets up a socket connection to the matching service server.
 *
 * @param {Function} onMatchSuccess - callback function for successful match
 * @param {Function} onMatchFailure - callback function for failed match
 * @param {Function} onMatchCancel - callback function for successful match cancellation
 * @param {Function} onSocketDisconnect - callback function for socket disconnect
 * @returns {Socket} socket created
 */
const setupSocket = (
  onMatchSuccess,
  onMatchFailure,
  onMatchCancel,
  onSocketDisconnect
) => {
  console.log(ENDPOINT);
  const socket = socketIOClient(ENDPOINT);

  socket.on("connect", () => {
    console.log("socket connected");
  });

  socket.on("disconnect", () => {
    onSocketDisconnect?.();
  });

  // Custom events
  socket.on("match-success", (successMsg) => {
    onMatchSuccess?.(successMsg);
  });

  socket.on("match-failure", (errorMsg) => {
    onMatchFailure?.(errorMsg);
  });

  socket.on("match-cancelled", (cancelMsg) => {
    onMatchCancel?.();
  });

  socket.on("create-session", async (sessionCreationRequest, callback) => {
    const {
      roomId,
      firstUserId,
      firstUserName,
      secondUserId,
      secondUserName,
      complexity,
    } = sessionCreationRequest;

    const question = await getRandomQuestionByComplexity(complexity);

    const sessionDetails = {
      roomId,
      firstUserId,
      firstUserName,
      secondUserId,
      secondUserName,
      ...question,
    };

    const session = await createSession(sessionDetails);

    console.log("session");
    console.log(session);
    console.log(question);
    console.log(sessionDetails);

    callback(session?.data);
  });

  return socket;
};

export default setupSocket;
