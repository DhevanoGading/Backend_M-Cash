const express = require("express");
const router = express.Router();
const { addBudgetValidator } = require("../Middleware/inputValidator");
const budgetController = require("../Controllers/budgetController");
const { validateToken } = require("../Middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: API endpoints for Budget operation
 * components:
 *    schemas:
 *      Budget:
 *        type: object
 *        properties:
 *          amount:
 *            type: integer
 */
/**
 * @swagger
 * /budget:
 *  post:
 *    tags: [Budget]
 *    summary: Add Budget
 *    description: This api is used to Add Budget
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Budget'
 *    responses:
 *      200:
 *        description: Add Budget successfully
 */
router.post("/", validateToken, addBudgetValidator, budgetController.addBudget);
/**
 * @swagger
 * /budget:
 *  put:
 *    tags: [Budget]
 *    summary: Update Budget
 *    description: This api is used to Update Budget
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Budget'
 *    responses:
 *      200:
 *        description: Update Budget successfully
 */
router.put("/", validateToken, addBudgetValidator, budgetController.updateBudget);

module.exports = router;
