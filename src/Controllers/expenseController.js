const client = require("../config/appwritter");
const { validationResult } = require("express-validator");
const { generateId } = require("../utils/generateId");
const { Databases, ID } = require("node-appwrite");
const databases = new Databases(client);
const databaseId = process.env.APP_WRITTER_DATABASE_ID;
const collectionExpensesId = process.env.APP_WRITTER_COLLECTION_EXPENSES_ID;
const lengthId = process.env.APP_LENGTH_ID_GENERATOR;

module.exports = {
  listExpense: async (req, res) => {
    try {
      const expense = await databases.listDocuments(
        databaseId,
        collectionExpensesId
      );

      res.status(200).json({
        message: "Get List Expense Successfully!",
        expense,
      });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({
        message: "Error executing query",
        error: error.message,
      });
    }
  },
  listExpenseById: async (req, res) => {
    try {
      const { user_id } = req.params;
      const expenseDocuments = await databases.listDocuments(
        databaseId,
        collectionExpensesId
      );

      const expense = expenseDocuments.documents.find(
        (e) => e.user_id === user_id
      );

      if (!expense) {
        return res
          .status(404)
          .json({ message: `Expense user with id ${user_id} not found!` });
      }

      if (expense.user_id !== req.user.user_id) {
        return res
          .status(401)
          .json({ message: `User not Autenticated with id ${user_id}!` });
      }

      res.status(200).json({
        message: "Get List Expense Successfully!",
        expense,
      });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({
        message: "Error executing query",
        error: error.message,
      });
    }
  },
  detailExpense: async (req, res) => {
    try {
      const { document_id } = req.params;

      const expenseDocuments = await databases.listDocuments(
        databaseId,
        collectionExpensesId
      );

      const expense = expenseDocuments.documents.find(
        (e) => e.$id === document_id
      );

      if (!expense) {
        return res.status(404).json({
          message: `Expense user with document id ${document_id} not found!`,
        });
      }

      if (expense.user_id !== req.user.user_id) {
        return res.status(401).json({
          message: `User not Autenticated with document id ${document_id}!`,
        });
      }

      res.status(200).json({
        message: "Get Detail Expense Successfully!",
        expense,
      });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({
        message: "Error executing query",
        error: error.message,
      });
    }
  },
  addExpenses: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const expense = {
        expense_id: await generateId(lengthId),
        user_id: req.user.user_id,
        name: req.body.name,
        description: req.body.description,
        expense_date: req.body.expense_date,
        amount: req.body.amount,
      };

      await databases.createDocument(
        databaseId,
        collectionExpensesId,
        ID.unique(),
        expense
      );

      res.status(200).json({
        message: "Add Expense Successfully!",
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
