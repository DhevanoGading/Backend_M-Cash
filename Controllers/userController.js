const db = require("../db");
const util = require("util");
const bcrypt = require("bcrypt");
const dbQuery = util.promisify(db.query).bind(db);
const { validationResult } = require("express-validator");
const { checkExistingUsername } = require("../Middleware/checkExistingData");
const { generateTokens } = require("../Middleware/auth");

module.exports = {
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const user = {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        name: req.body.name,
      };

      const validationMessage = await checkExistingUsername(user.username);
      if (validationMessage) {
        return res.status(409).json({ error: validationMessage });
      }

      await dbQuery(`INSERT INTO users SET ?`, user);

      res.status(200).json({
        message: "Register Successfully!",
      });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({
        message: "Error executing query",
        error: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const username = req.body.username;
      const password = req.body.password;

      const user = await dbQuery(`SELECT * FROM users WHERE username = ?`, [
        username,
      ]);

      if (user.length === 0) {
        return res
          .status(401)
          .json({ error: `Username ${username} Doesn't Exist!` });
      }

      const passwordMatch = await bcrypt.compare(password, user[0].password);

      if (passwordMatch) {
        const accessToken = generateTokens(user[0]);
        res.cookie("access_token", accessToken, {
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
          message: "Logged in Succesfully!",
          data,
        });
      } else {
        res.status(401).json({
          message: "Invalid Password",
        });
      }
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({
        message: "Error executing query",
        error: error.message,
      });
    }
  },
  logout: (req, res) => {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logged out successfully" });
  },
};
