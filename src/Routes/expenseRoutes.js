const express = require("express");
const router = express.Router();
const { addExpenseValidator } = require("../Middleware/inputValidator");
const expenseController = require("../Controllers/expenseController");
const { validateToken } = require("../Middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Expense
 *   description: API endpoints for Expense operation
 * components:
 *    schemas:
 *      Expense:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          expense_date:
 *            type: string
 *            format: date
 *          amount:
 *            type: integer
 */
/**
 * @swagger
 * /expense:
 *  post:
 *    tags: [Expense]
 *    summary: Add Expense
 *    description: This api is used to Add Expense
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Expense'
 *    responses:
 *      200:
 *        description: Add Expense successfully
 */
router.post("/", validateToken, addExpenseValidator, expenseController.addExpenses);
/**
 * @swagger
 * components:
 *    schemas:
 *      ExpenseList:
 *        type: object
 *        properties:
 *          startDate:
 *            type: string
 *            format: date
 *          endDate:
 *            type: string
 *            format: date
 */
/**
 * @swagger
 * /expense/list:
 *  post:
 *    tags: [Expense]
 *    summary: Get list Expense and budget filtered
 *    description: This api is used to get list all data expense user filtered by start and end date, also getting total budget
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/ExpenseList'
 *    responses:
 *      200:
 *        description: Get All Expense successfully
 */
router.post("/list", validateToken, expenseController.listExpenseById);
/**
 * @swagger
 * /expense/{document_id}:
 *  get:
 *    tags: [Expense]
 *    summary: Get detail Expense by document id
 *    description: This api is used to get detail data expense user
 *    parameters:
 *     - in: path
 *       name: document_id
 *       required: true
 *       description: String required
 *       schema:
 *         type: string
 *    responses:
 *      200:
 *        description: Get Detail Expense successfully
 */
router.get("/:document_id", validateToken, expenseController.detailExpense);
/**
 * @swagger
 * /expense/{document_id}:
 *  put:
 *    tags: [Expense]
 *    summary: Update Expense by document id
 *    description: This api is used to update data expense user
 *    parameters:
 *     - in: path
 *       name: document_id
 *       required: true
 *       description: String required
 *       schema:
 *         type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Expense'
 *    responses:
 *      200:
 *        description: Update Expense successfully
 */
router.put("/:document_id", validateToken, addExpenseValidator, expenseController.updateExpense);
/**
 * @swagger
 * /expense/{document_id}:
 *  delete:
 *    tags: [Expense]
 *    summary: Delete Expense by document id
 *    description: This api is used to delete data expense user
 *    parameters:
 *     - in: path
 *       name: document_id
 *       required: true
 *       description: String required
 *       schema:
 *         type: string
 *    responses:
 *      200:
 *        description: Delete Expense successfully
 */
router.delete("/:document_id", validateToken, expenseController.deleteExpense);

module.exports = router;
