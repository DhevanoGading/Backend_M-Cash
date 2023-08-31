const express = require("express");
const router = express.Router();
const { addBudgetValidator } = require("../Middleware/inputValidator");
const budgetController = require("../Controllers/budgetController");
const { validateToken } = require("../Middleware/auth");

router.post("/", validateToken, addBudgetValidator, budgetController.addBudget);
router.put(
  "/:document_id",
  validateToken,
  addBudgetValidator,
  budgetController.updateBudget
);
router.get("/list", validateToken, budgetController.listBudget);

module.exports = router;
