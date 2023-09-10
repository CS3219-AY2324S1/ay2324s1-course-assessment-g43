const pool = require("../db.js");

exports.createUser = (req, res) => {
    const { username, email, pass } = req.body

    pool.query('INSERT INTO Users (username, email, pass) VALUES ($1, $2, $3) RETURNING *', [username, email, pass], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`User added with ID: ${results.rows[0].uid}`)
    })
}

exports.getUsers = (req, res) => {
    pool.query('SELECT * FROM Users ORDER BY uid ASC', (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
      })
}

exports.getUser = (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('SELECT * FROM Users WHERE uid = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
}

exports.userLogin = (req, res) => {
    try {
        console.log(req);
    } catch(err) {
        console.log(err.message);
    }
}

exports.userLogout = (req, res) => {
    try {
        console.log(req);
    } catch(err) {
        console.log(err.message);
    }
}

exports.updateProfile = (req, res) => {
    const id = parseInt(req.params.id)
    const { username, email, pass } = req.body
  
    pool.query(
      'UPDATE Users SET username = $1, email = $2, pass = $3 WHERE uid = $4',
      [username, email, pass, id],
      (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send(`User modified with ID: ${id}`)
      }
    )
}

exports.deleteProfile = (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('DELETE FROM Users WHERE uid = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User deleted with ID: ${id}`)
    })
}

