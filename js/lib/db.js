require("dotenv").config();
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  port: process.env.PORT_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE_DB
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Database is connected successfully');
});
module.exports = connection;