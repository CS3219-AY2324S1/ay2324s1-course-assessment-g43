const Pool = require('pg').Pool;
require("dotenv").config();

const host = process.env.PSQL_HOST;
const password = process.env.PSQL_PASSWORD;
const user = process.env.PSQL_USER;
const database = process.env.PSQL_DATABASE;

const pool = new Pool({
  user,
  password,
  host,
  port: 5432,
  database
});

module.exports = pool;
