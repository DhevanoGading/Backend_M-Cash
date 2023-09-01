const express = require("express");
const router = express.Router();
const { addExpenseValidator } = require("../Middleware/inputValidator");
const expenseController = require("../Controllers/expenseController");
const { validateToken } = require("../Middleware/auth");

router.post("/", validateToken, addExpenseValidator, expenseController.addExpenses);
router.post("/list", validateToken, expenseController.listExpenseById);
router.get("/:document_id", validateToken, expenseController.detailExpense);
router.put("/:document_id", validateToken, addExpenseValidator, expenseController.updateExpense);
router.delete("/:document_id", validateToken, expenseController.deleteExpense);

module.exports = router;
