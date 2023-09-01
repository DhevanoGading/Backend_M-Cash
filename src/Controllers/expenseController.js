const client = require("../config/appwritter");
const { Databases, ID } = require("node-appwrite");
const { validationResult } = require("express-validator");
const { generateId } = require("../utils/generateId");
const { responseTemplate } = require("../utils/responseTemplate");
const databases = new Databases(client);
const databaseId = process.env.APP_WRITTER_DATABASE_ID;
const collectionExpensesId = process.env.APP_WRITTER_COLLECTION_EXPENSES_ID;
const collectionBudgetsId = process.env.APP_WRITTER_COLLECTION_BUDGETS_ID;
const lengthId = process.env.APP_LENGTH_ID_GENERATOR;

module.exports = {
  listExpenseById: async (req, res) => {
    try {
      const { user_id } = req.user;
      const expenseDocuments = await databases.listDocuments(
        databaseId,
        collectionExpensesId
      );

      const expense = expenseDocuments.documents.filter(
        (e) => e.user_id === user_id
      );

      const budget = expenseDocuments.documents.find(
        (e) => e.user_id === user_id
      );

      await responseTemplate(
        res,
        200,
        "Get List Expense Successfully!",
        expense,
        budget.amount
      );
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
          message: `Expense not found!`,
        });
      }

      if (expense.user_id !== req.user.user_id) {
        return res.status(401).json({
          message: `User is not authenticated with that document id!`,
        });
      }

      await responseTemplate(
        res,
        200,
        "Get Detail Expense Successfully!",
        expense
      );
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
  updateExpense: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const { document_id } = req.params;
      const { user_id } = req.user;

      const expenseDocuments = await databases.listDocuments(
        databaseId,
        collectionExpensesId
      );

      const expense = expenseDocuments.documents.find(
        (e) => e.$id === document_id
      );

      if (!expense) {
        return res.status(404).json({
          message: `Expense not found!`,
        });
      }

      if (expense.user_id !== user_id) {
        return res.status(401).json({
          message: `User is not authenticated with that document id!`,
        });
      }

      const newExpense = {
        expense_id: expense.expense_id,
        user_id,
        name: req.body.name,
        description: req.body.description,
        expense_date: req.body.expense_date,
        amount: req.body.amount,
      };

      await databases.updateDocument(
        databaseId,
        collectionExpensesId,
        expense.$id,
        newExpense
      );

      res.status(200).json({
        message: "Update Expense Successfully!",
      });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({
        message: "Error executing query",
        error: error.message,
      });
    }
  },
  deleteExpense: async (req, res) => {
    try {
      const { document_id } = req.params;

      try {
        await databases.deleteDocument(
          databaseId,
          collectionExpensesId,
          document_id
        );
      } catch (error) {
        return res.status(404).json({ message: error.message });
      }

      res.status(200).json({
        message: "Delete Expense Successfully!",
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
