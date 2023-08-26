const mysql = require("mysql");

//connect
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mcash",
});

module.exports = db;
