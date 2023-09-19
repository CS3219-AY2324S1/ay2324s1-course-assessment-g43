const pool = require("../db.js");

exports.checkIfNameOrEmailExists = async (username, email) => {
    const user = await pool.query("SELECT * FROM Users WHERE username = $1 OR email = $2", [username, email]);
    
    if (user.rows.length > 0) {
        return true;
    } else {
        return false;
    }
}