const axios = require("axios");
const { getUserIdsFromRoomId } = require("../utils/utils");

const basePath = "http://localhost:8000/api";

const verifyToken = async (token) => {
  const res = await axios.get(`${basePath}/verifyToken`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("No JWT token received");
    return res.status(401).json({
      message: `No authorization token received.`,
      data: {},
    });
  }
  try {
    const verificationResponse = await verifyToken(token);
    if (verificationResponse.isValid) {
      req.decodedToken = verificationResponse.decodedToken;
      next();
    } else {
      return res.status(401).json({
        message: verificationResponse.message,
        data: {},
      });
    }
  } catch (err) {
    console.log(err.message);
    return err.response?.status == 401
      ? res.status(401).json({
          message: `Invalid token: ${err.response.data.message}`,
          data: {},
        })
      : res.status(500).json({
          message: `Internal server error during token verification: ${err.message}`,
          data: {},
        });
  }
};

// * Note: Only use this if roomId is a param in the route
exports.checkAuthorization = (req, res, next) => {
  const roomId = req.params.roomId;
  const requestorUid = req.decodedToken?.uid;
  const roomParticipantsUids = getUserIdsFromRoomId(roomId);
  if (!roomParticipantsUids.includes(requestorUid)) {
    return res.status(403).end();
  }
  next();
};