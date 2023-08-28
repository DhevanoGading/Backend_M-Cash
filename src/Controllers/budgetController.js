const client = require("../config/appwritter");
const { validationResult } = require("express-validator");
const { generateId } = require("../utils/generateId");
const { Databases, ID } = require("node-appwrite");
const databases = new Databases(client);
const databaseId = process.env.APP_WRITTER_DATABASE_ID;
const collectionBudgetsId = process.env.APP_WRITTER_COLLECTION_BUDGETS_ID;

module.exports = {
  addBudget: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const budget = {
        budget_id: await generateId(5),
        user_id: req.user.user_id,
        amount: req.body.amount,
      };

      await databases.createDocument(
        databaseId,
        collectionBudgetsId,
        ID.unique(),
        budget
      );

      res.status(200).json({
        message: "Add Budget Successfully!",
      });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({
        message: "Error executing query",
        error: error.message,
      });
    }
  },
};
