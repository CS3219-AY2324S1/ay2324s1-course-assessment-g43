const pool = require("../db.js");

exports.isValidPassword = (password) => {
  if (!password) return false;
  const isLongEnough = password.length >= 8;
  const containsWhitespace = /\s/g.test(password);
  return isLongEnough && !containsWhitespace;
};

exports.checkIfNameOrEmailExists = async (username, email) => {
  const user = await pool.query("SELECT * FROM Users WHERE username = $1 OR email = $2", [username, email]);
    
  return user.rows.length > 0;
}