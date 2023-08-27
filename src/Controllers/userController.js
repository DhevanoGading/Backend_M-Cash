const bcrypt = require("bcrypt");
const client = require("../config/appwritter");
const { validationResult } = require("express-validator");
const { generateTokens } = require("../Middleware/auth");
const { Databases, ID } = require("node-appwrite");

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
        nama: req.body.name,
      };

      const databases = new Databases(client);

      await databases.createDocument(
        process.env.APP_WRITTER_DATABASE_ID,
        process.env.APP_WRITTER_COLLECTION_ID,
        ID.unique(),
        {
          id_user: ID.unique(),
          ...user,
        }
      );

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

      const databases = new Databases(client);

      const response = await databases.listDocuments(
        process.env.APP_WRITTER_DATABASE_ID,
        process.env.APP_WRITTER_COLLECTION_ID
      );

      const users = response.documents;

      const loginCheck = users.find((e) => {
        return e.username === username && bcrypt.compare(password, e.password);
      });

      if (loginCheck) {
        const accessToken = generateTokens(loginCheck);
        res.cookie("access_token", accessToken, {
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
          message: "Logged in Succesfully!",
        });
      } else {
        res.status(401).json({
          message: "Invalid Password or Username",
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
