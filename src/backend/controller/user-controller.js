const pool = require("../db.js");
const validator = require("../utils/validator.js");

exports.createUser = async (req, res) => {
    const { username, email, password } = req.body

    try {
      const userExists = await validator.checkIfNameOrEmailExists(username, email);

      if (userExists) {
        return res.status(401).json({ 
          message: 'Username or email already exists',
          data: {} 
        })
      }

      let newUser = await pool.query(
        'INSERT INTO Users (username, email, password) VALUES ($1, $2, $3) RETURNING *', 
        [username, email, password]
      );

      return res.status(201).send({ 
          message: `User added with ID: ${newUser.rows[0].uid}`,
          data: { user: newUser.rows[0] } 
        })

    } catch (error) {
      console.error(error.message);
      
      return res.status(500).send({
        message: 'Server error' + error.message,
        data: {} 
      });
    }
}

exports.getUsers = async (req, res) => {

  try {
    const users = await pool.query('SELECT * FROM Users ORDER BY uid ASC');

    return res.status(200).json({
      message: 'Users retrieved',
      data: { users: users.rows }
    });

  } catch (error) {
    return res.status(500).send({
      message: 'Server error' + error.message,
      data: {} 
    });
  }
}

exports.getUser = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const result = await pool.query('SELECT * FROM Users WHERE uid = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        message: 'User does not exist',
        data: {} 
      })
    }

    return res.status(200).json({
      message: 'User retrieved',
      data: { user: result.rows[0] }
    });

  } catch (error) {
    return res.status(500).send({
      message: 'Server error' + error.message,
      data: {} 
    });
  }

}

exports.userLogin = async (req, res) => {
  const { email, password } = req.body
  const BLANK_USERNAME = "";

  try {
    const emailExists = await validator.checkIfNameOrEmailExists(BLANK_USERNAME, email);

    if (!emailExists) {
      return res.status(401).json({ 
        message: 'Email does not exist',
        data: {} 
      })
    }

    const result = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);

    const validPassword = result.rows[0].password === password

    if (!validPassword) {
      return res.status(401).json({ 
        message: 'Password is wrong',
        data: {} 
      })
    }

    return res.status(200).json({
      message: 'User logged in',
      data: { user: result.rows[0] }
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Server error' + error.message,
      data: {} 
    });
  }
}

exports.userLogout = async (req, res) => {
  try {
    console.log(req);
  } catch(err) {
    console.log(err.message);
  }
}

exports.updateProfile = async (req, res) => {
  const id = parseInt(req.params.id)
  const { username, email, password } = req.body
  
  try {
    const userExists = await validator.checkIfNameOrEmailExists(username, email);

    if (userExists) {
      return res.status(401).json({ 
        message: 'Username or email already exists',
        data: {}
      })
    }

    const result = await pool.query('SELECT * FROM Users WHERE uid = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        message: `User with ID: ${id} does not exist`,
        data: {} 
      })
    }

    let updatedUser = await pool.query(
      'UPDATE Users SET username = $1, email = $2, password = $3 WHERE uid = $4 RETURNING *',
      [username, email, password, id],
    );

    return res.status(200).send({
      message: `User modified with ID: ${id}`,
      data: { user: updatedUser.rows[0] }
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).send({
      message: 'Server error' + error.message,
      data: {} 
    });
  }
}


exports.deleteProfile = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const result = await pool.query('SELECT * FROM Users WHERE uid = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        message: `User with ID: ${id} does not exist`,
        data: {} 
      })
    }

    const deletedUser = await pool.query('DELETE FROM Users WHERE uid = $1 RETURNING *', [id]);

    return res.status(200).send({
      message: `User deleted with ID: ${id}`,
      data: { user: deletedUser.rows[0] }
    });

  } catch (error) {
    return res.status(500).send({
      message: 'Server error' + error.message,
      data: {} 
    });
  }
}

