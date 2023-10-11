const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60 //value in SECONDS
exports.createToken = (uid, usertype) => {
    let token;
    try {
        token = jwt.sign({ uid, usertype },process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: maxAge
        });
        return token;
    } catch (err) {
        console.error("Unable to create JWT. Error: ", err);
        throw err;
    }
}

exports.authenticateRequest = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        console.log("No JWT token received");
        return res.status(401).json({ 
            message: `No authorization token received.`,
            data: {} 
        })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ 
                message: `Invalid authorization token received. Denied Access.`,
                data: {} 
            })
        }
        next();
    })
}

exports.authenticateToken = (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        console.log("No JWT token received");
        return res.status(401).json({
            message: `No authorization token received.`,
            data: {}
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) {
            res.status(401).json({
                isValid: false,
                message: `Invalid authorization token received. Denied Access.`,
                data: {}
            });
        } else {
            res.status(200).json({
                isValid: true,
                message: "Token is valid",
                data: {}
            });
        }
    });
}