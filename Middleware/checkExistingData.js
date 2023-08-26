const db = require("../db");

const checkExistingUsername = (username) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          resolve(`Username ${username} already exists!`);
        } else {
          resolve(null);
        }
      }
    });
  });
};

module.exports = { checkExistingUsername };
