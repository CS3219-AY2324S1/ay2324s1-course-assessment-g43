const axios = require("axios");

const basePath = process.env.USER_BASE_PATH || "http://localhost:8000/api";

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