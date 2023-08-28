const { check } = require("express-validator");

exports.registerValidator = [
  check("username").notEmpty().withMessage(`Username must be filled!`),
  check("password")
    .isLength({ min: 6 })
    .withMessage(`Password at least 6 characters!`),
  check("name").notEmpty().withMessage(`Names must be filled!`),
];

exports.loginValidator = [
  check("username").notEmpty().withMessage(`Username must be filled!`),
  check("password").notEmpty().withMessage(`Password must be filled!`),
];

exports.addBudgetValidator = [
  check("amount")
    .notEmpty()
    .withMessage(`Amount must be filled!`)
    .isNumeric()
    .withMessage(`Amount must be a numeric!`),
];

exports.addExpenseValidator = [
  check("name").notEmpty().withMessage(`Name must be filled!`),
  check("expense_date").notEmpty().withMessage(`Expense Date must be filled!`),
  check("amount")
    .notEmpty()
    .withMessage(`Amount must be filled!`)
    .isNumeric()
    .withMessage(`Amount must be a numeric!`),
];
