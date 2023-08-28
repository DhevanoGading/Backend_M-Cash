const express = require("express");
const router = express.Router();
const { addExpenseValidator } = require("../Middleware/inputValidator");
const expenseController = require("../Controllers/expenseController");
const { validateToken } = require("../Middleware/auth");

router.post("/", validateToken, addExpenseValidator, expenseController.addExpenses);
router.get("/list", validateToken, expenseController.listExpense);
router.get("/list/:user_id", validateToken, expenseController.listExpenseById);
router.get("/detail/:document_id", validateToken, expenseController.detailExpense);

module.exports = router;
