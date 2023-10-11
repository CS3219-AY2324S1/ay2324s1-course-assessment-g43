const axios = require("axios");
const jwtDecode = require("jwt-decode");

const basePath = "http://localhost:5000/api";

const verifyToken = async(token) => {
  try {
    const res = await axios.get(`${basePath}/verifyToken`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error verifying token: ", error);
    throw error;
  }
};

exports.authenticate = async(req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    console.log("No JWT token received");
    return res.status(401).json({ 
      message: `No authorization token received.`,
      data: {} 
    })
  }
  try {
    const verificationResponse = await verifyToken(token);
    if (verificationResponse.isValid) {
      next();
    } else {
      return res.status(401).json({ 
        message: verificationResponse.message,
        data: {} 
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ 
      message: `Internal server error during token verification.: ${error}`,
      data: {} 
    });
  }
};

exports.checkAuthorization = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        console.log("No JWT token received");
        return res.status(401).json({ 
            message: `No authorization token received.`,
            data: {} 
        })
    }
    try {
        const decodedToken = jwtDecode(token);
        const userType = decodedToken.usertype;
        if (userType == "admin") {
          next();
        } else {
          return res.status(403).json({ 
            message: `Unauthorized user type. Denied Access.`,
            data: {} 
          })
        }
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: 'Invalid token format' });
    }
}
