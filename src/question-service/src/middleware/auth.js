const axios = require("axios");

const basePath = "http://localhost:5000/api";

const verifyToken = async(token) => {
    try {
        const res = await axios.get(`${basePath}/verifyToken/${token}`);
        console.log(res); //delete
        console.log(res.data);
        return res.data; //change to response from api call;
    } catch (error) {
        console.error("Error verifying token:", error);
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
            // Token is valid; proceed with the next middleware
            console.log("succcessfully authenticated") //delete
            next();
        } else {
            return res.status(403).json({ 
              message: verificationResponse.message,
              data: {} 
            });
        }
    } catch (error) {
        console.log(error)
        // Handle errors that occurred during token verification
        return res.status(500).json({ 
        message: `Internal server error during token verification.: ${error}`,
        data: {} 
        });
    }
};