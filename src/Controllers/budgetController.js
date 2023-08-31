const client = require("../config/appwritter");
const { validationResult } = require("express-validator");
const { generateId } = require("../utils/generateId");
const { Databases, ID } = require("node-appwrite");
const databases = new Databases(client);
const databaseId = process.env.APP_WRITTER_DATABASE_ID;
const collectionBudgetsId = process.env.APP_WRITTER_COLLECTION_BUDGETS_ID;
const lengthId = process.env.APP_LENGTH_ID_GENERATOR;

module.exports = {
  addBudget: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const budgetData = {
        budget_id: await generateId(lengthId),
        user_id: req.user.user_id,
        amount: req.body.amount,
      };

      const budgetDocuments = await databases.listDocuments(
        databaseId,
        collectionBudgetsId
      );

      const budget = budgetDocuments.documents.find(
        (e) => e.user_id === budgetData.user_id
      );

      if (budget) {
        return res.status(404).json({ message: `User already has a budget!` });
      }

      await databases.createDocument(
        databaseId,
        collectionBudgetsId,
        ID.unique(),
        budgetData
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
  updateBudget: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const { user_id } = req.user;

      const budgetDocuments = await databases.listDocuments(
        databaseId,
        collectionBudgetsId
      );

      const budget = budgetDocuments.documents.find(
        (e) => e.user_id === user_id
      );

      const newBudget = {
        budget_id: budget.budget_id,
        user_id,
        amount: req.body.amount,
      };

      await databases.updateDocument(
        databaseId,
        collectionBudgetsId,
        budget.$id,
        newBudget
      );

      res.status(200).json({
        message: "Update Budget Successfully!",
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
