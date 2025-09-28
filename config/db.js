<<<<<<< HEAD
const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

module.exports = pool.promise();
=======
const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

module.exports = pool.promise();
>>>>>>> eb502bf00be535d061ae0d80bd7706d57f4f4bb4
