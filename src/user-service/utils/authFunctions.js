const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60//value in SECONDS

exports.createToken = (email) => {
    let token;
    try {
        token = jwt.sign({ email },process.env.ACCESS_TOKEN_SECRET,{
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
    console.log("jwt received, proceeding to verfy") //to be deleted
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
        if (err) {
            return res.status(403).json({ 
                message: `Invalid authorization token received. Denied Access.`,
                data: {} 
            })
        }
        console.log("verified"); //to be deleted
        next();
    })
}

//for question-service to call
exports.authenticateToken = (req, res) => {
    const token = req.params.token;
    if (token == null) {
        console.log("No JWT token received");
        return res.status(401).json({ 
            message: `No authorization token received.`,
            data: {} 
        })
    }
    console.log("jwt received, proceeding to verfy") //to be deleted
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
        if (err) {
            res.status(403).json({
                isValid: false,
                message: `Invalid authorization token received. Denied Access.`,
                data: {}
            });
        } else {
            res.status(200).json({
                isValid: true,
                message: 'Token is valid',
                data: {} 
            });
        }
    });
}
