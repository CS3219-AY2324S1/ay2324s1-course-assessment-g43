// import { EASY_QUEUE, HARD_QUEUE, MEDIUM_QUEUE, MATCH_REPLY_QUEUE, QUESTION_COMPLEXITY_LIST, TIMEOUT_MS } from "./constants.js";
const { EASY_QUEUE, HARD_QUEUE, MEDIUM_QUEUE, MATCH_REPLY_QUEUE, QUESTION_COMPLEXITY_LIST, TIMEOUT_MS } = require("./constants.js");

const getQueue = (complexity) => {
  switch (complexity) {
    case QUESTION_COMPLEXITY_LIST[0]:
      return EASY_QUEUE;
    case QUESTION_COMPLEXITY_LIST[1]:
      return MEDIUM_QUEUE;
    case QUESTION_COMPLEXITY_LIST[2]:
      return HARD_QUEUE;
    default:
      return null;
  }
};

const handleCancelRequest = async (channel, index, socketId, userId, pendingSocketRequests, pendingUserIds, pendingTimeouts) => {
  
  console.log("cancel request");

  await channel.assertQueue(MATCH_REPLY_QUEUE, { durable: false, messageTtl: 30000 });

  if (!pendingSocketRequests[index]) {
    return;
  }
  
  if (pendingSocketRequests[index] === socketId) {
    clearTimeout(pendingTimeouts[index]);
    pendingSocketRequests[index] = null;

    const matchCancelMesssage = {
      isMatchCancel: true,
      firstUserSocketId: socketId,
      firstUserId: userId,
    }
    channel.sendToQueue(MATCH_REPLY_QUEUE, Buffer.from(JSON.stringify(matchCancelMesssage)));
  }
}

const handleSaveMatchRequest = async (channel, index, socketId, userId, pendingSocketRequests, pendingUserIds, pendingTimeouts) => {
  
  console.log("save match request");

  const messageTimeout = setTimeout(() => {
    pendingSocketRequests[index] = null;
  }, TIMEOUT_MS);
  
  pendingSocketRequests[index] = socketId;
  pendingUserIds[index] = userId;
  pendingTimeouts[index] = messageTimeout;
}

const handleSuccessMatchRequest = async (channel, index, socketId, userId, pendingSocketRequests, pendingUserIds, pendingTimeouts) => {

  console.log("success match request");

  await channel.assertQueue(MATCH_REPLY_QUEUE, { durable: false, messageTtl: 30000 });

  clearTimeout(pendingTimeouts[index]);

  const firstUserSocketId = pendingSocketRequests[index];
  const firstUserId = pendingUserIds[index];

  const secondUserSocketId = socketId;
  const secondUserId = userId;

  pendingSocketRequests[index] = null;
  pendingUserIds[index] = null;

  const matchSuccessMessage = {
    isMatchCancel: false,
    firstUserSocketId,
    secondUserSocketId,
    firstUserId, 
    secondUserId,
    complexity: QUESTION_COMPLEXITY_LIST[index]
  };

  channel.sendToQueue(MATCH_REPLY_QUEUE, Buffer.from(JSON.stringify(matchSuccessMessage)));
}


exports.listenToQueue = async (channel) => {
  await channel.assertQueue(EASY_QUEUE, { durable: false, messageTtl: 30000 });
  await channel.assertQueue(MEDIUM_QUEUE, { durable: false, messageTtl: 30000 });
  await channel.assertQueue(HARD_QUEUE, { durable: false, messageTtl: 30000 });

  const queueNames = [EASY_QUEUE, MEDIUM_QUEUE, HARD_QUEUE];
  const pendingSocketRequests = [null, null, null];
  const pendingUserIds= [null, null, null];
  const pendingTimeouts = [null, null, null];

  for (let index = 0; index < queueNames.length; index++) {
    const queueName = queueNames[index];

    channel.consume(queueName, (message) => {
      if (!message) {
        return;
      }

      // console.log(message)
      
      console.log("consumed queue message");

      const { isCancelRequest, userId, socketId } = JSON.parse(message.content.toString());

      if (isCancelRequest) {
        handleCancelRequest(channel, index, socketId, userId, pendingSocketRequests, pendingUserIds, pendingTimeouts);
      } else if (!pendingSocketRequests[index]) {
        handleSaveMatchRequest(channel, index, socketId, userId, pendingSocketRequests, pendingUserIds, pendingTimeouts);
      } else {
        handleSuccessMatchRequest(channel, index, socketId, userId, pendingSocketRequests, pendingUserIds, pendingTimeouts);
      }
    }, { noAck: true});
    
  }
}

exports.listenToReplies = async (channel, io) => {

  await channel.assertQueue(MATCH_REPLY_QUEUE, { durable: false, messageTtl: 30000 });

  channel.consume(MATCH_REPLY_QUEUE, async (message) => {

    console.log("received reply")

    const parsedReply = JSON.parse(message.content.toString());

    if (parsedReply.isMatchCancel) {
      const socketId = parsedReply.firstUserSocketId;
      io.to(socketId).emit("match-cancelled", "Match cancelled");

      if (io.sockets.sockets.get(socketId)) {
        io.sockets.sockets.get(socketId).disconnect(true);
      }

      return;
    }

    const firstUserSocketId = parsedReply.firstUserSocketId;
    const firstUserId = parsedReply.firstUserId;

    const secondUserSocketId = parsedReply.secondUserSocketId;
    const secondUserId = parsedReply.secondUserId;

    const complexity = parsedReply.complexity;

    const timestamp = Math.floor(Date.now() / 1000);
    const roomId = `${timestamp}-${firstUserId}-${secondUserId}`;

    const sessionCreationRequest = {
      roomId,
      firstUserId,
      secondUserId,
      complexity,
    };

    const firstUserSocket = io.sockets.sockets.get(firstUserSocketId);
    
    firstUserSocket.emit("create-session", sessionCreationRequest, async (session) => {
      if (!session) {
        io.to(firstUserSocketId).emit("match-failure", "Failed to create session! User is possibly in another room");
        io.to(secondUserSocketId).emit("match-failure", "Failed to create session! User is possibly in another room");
        return;
      }

      const firstSession = session;

      console.log("i go session");

      io.to(firstUserSocketId).emit("match-success", firstSession);
      io.to(secondUserSocketId).emit("match-success", firstSession);
    });

  }, { noAck: true});
}

exports.getQueue = getQueue;


