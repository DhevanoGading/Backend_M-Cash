const bcrypt = require("bcrypt");
const client = require("../config/appwritter");
const { validationResult } = require("express-validator");
const { generateTokens } = require("../Middleware/auth");
const { generateId } = require("../utils/generateId");
const { Databases, ID } = require("node-appwrite");
const databases = new Databases(client);
const databaseId = process.env.APP_WRITTER_DATABASE_ID;
const collectionUsersId = process.env.APP_WRITTER_COLLECTION_USERS_ID;
const lengthId = process.env.APP_LENGTH_ID_GENERATOR;

module.exports = {
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const user = {
        user_id: await generateId(lengthId),
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        name: req.body.name,
      };

      await databases.createDocument(
        databaseId,
        collectionUsersId,
        ID.unique(),
        user
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

      const userDocuments = await databases.listDocuments(
        databaseId,
        collectionUsersId
      );

      const user = userDocuments.documents.find((e) => e.username === username);

      if (!user) {
        return res
          .status(404)
          .json({ message: `Username ${username} not found!` });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const accessToken = generateTokens(user);
        res.cookie("access_token", accessToken, {
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
          message: "Logged in Succesfully!",
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
