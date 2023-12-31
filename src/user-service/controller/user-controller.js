const pool = require("../db.js");
const validator = require("../utils/validator.js");
const bcrypt = require("bcrypt");
const authFunctions = require("../utils/auth-functions.js");

exports.createUser = async (req, res) => {
  let { username, email, password } = req.body;
  username = username?.trim();
  email = email?.trim();

  if (!validator.isValidPassword(password)) {
    return res.status(400).json({
      message:
        "Password cannot contain spaces and must be longer than 8 characters.",
      data: {},
    });
  }

  if (!username || !email) {
    return res.status(400).json({
      message:
        "Username, email, and password are necessary to register an account.",
      data: {},
    });
  }

  try {
    const userExists = await validator.checkIfNameOrEmailExists(
      username,
      email
    );

    if (userExists) {
      return res.status(400).json({
        message: "Username or email already exists",
        data: {},
      });
    }

    const hash = await bcrypt.hash(password, 10);

    let newUser = await pool.query(
      "INSERT INTO Users (username, email, password) VALUES ($1, $2, $3) RETURNING uid, username, email",
      [username, email, hash]
    );

    return res.status(201).send({
      message: `User added with ID: ${newUser.rows[0].uid}`,
      data: { user: newUser.rows[0] },
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).send({
      message: "Server error" + error.message,
      data: {},
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT uid, usertype, username, email FROM Users ORDER BY uid ASC"
    );
    return res.status(200).json({
      message: "Users retrieved",
      data: { users: users.rows },
    });
  } catch (error) {
    return res.status(500).send({
      message: "Server error" + error.message,
      data: {},
    });
  }
};

exports.getUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "SELECT uid, usertype, username, email FROM Users WHERE uid = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "User does not exist",
        data: {},
      });
    }

    return res.status(200).json({
      message: "User retrieved",
      data: { user: result.rows[0] },
    });
  } catch (error) {
    return res.status(500).send({
      message: "Server error: " + error.message,
      data: {},
    });
  }
};

exports.userLogin = async (req, res) => {
  let { email, password } = req.body;
  email = email?.trim();
  const BLANK_USERNAME = "";

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are necessary to login.",
      data: {},
    });
  }

  try {
    const emailExists = await validator.checkIfNameOrEmailExists(
      BLANK_USERNAME,
      email
    );

    if (!emailExists) {
      return res.status(400).json({
        message: "Invalid email or password",
        data: {},
      });
    }

    const result = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);

    const validPassword = await bcrypt.compare(
      password,
      result.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid email or password",
        data: {},
      });
    }

    const resultWithoutPassword = await pool.query(
      "SELECT uid, username, email FROM Users WHERE email = $1",
      [email]
    );

    //create JWT
    const uid = result.rows[0].uid;
    const usertype = result.rows[0].usertype;
    const token = authFunctions.createToken(uid, usertype);

    return res.status(200).json({
      message: "User logged in",
      data: { user: resultWithoutPassword.rows[0], jwt: token },
    });
  } catch (error) {
    return res.status(500).send({
      message: "Server error" + error.message,
      data: {},
    });
  }
};

exports.updateProfile = async (req, res) => {
  const id = parseInt(req.params.id);
  const decodedToken = req.decodedToken;
  if (id !== decodedToken.uid) {
    return res.status(403).end();
  }
  let { username, email } = req.body;
  username = username?.trim();
  email = email?.trim();
  if (!username || !email) {
    return res.status(400).json({
      message: "Username and email cannot be blank.",
      data: {},
    });
  }

  try {
    const usersOtherThanId = await pool.query(
      "SELECT * FROM Users WHERE uid !=$1 AND (username = $2 OR email = $3)",
      [id, username, email]
    );

    if (usersOtherThanId.rows.length > 0) {
      return res.status(400).json({
        message: "Username or email already exists",
        data: {},
      });
    }

    const result = await pool.query("SELECT * FROM Users WHERE uid = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: `User with ID: ${id} does not exist`,
        data: {},
      });
    }

    let updatedUser = await pool.query(
      "UPDATE Users SET username = $1, email = $2 WHERE uid = $3 RETURNING uid, username, email",
      [username, email, id]
    );

    return res.status(200).send({
      message: `User modified with ID: ${id}`,
      data: { user: updatedUser.rows[0] },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({
      message: "Server error" + error.message,
      data: {},
    });
  }
};

exports.deleteProfile = async (req, res) => {
  const id = parseInt(req.params.id);
  const decodedToken = req.decodedToken;
  if (id !== decodedToken.uid) {
    return res.status(403).end();
  }

  try {
    const result = await pool.query("SELECT * FROM Users WHERE uid = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(400).json({
        message: `User with ID: ${id} does not exist`,
        data: {},
      });
    }

    const deletedUser = await pool.query(
      "DELETE FROM Users WHERE uid = $1 RETURNING uid, username, email",
      [id]
    );

    return res.status(200).send({
      message: `User deleted with ID: ${id}`,
      data: { user: deletedUser.rows[0] },
    });
  } catch (error) {
    return res.status(500).send({
      message: "Server error" + error.message,
      data: {},
    });
  }
};
