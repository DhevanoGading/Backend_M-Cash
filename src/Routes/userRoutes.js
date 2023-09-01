const express = require("express");
const router = express.Router();
const {
  registerValidator,
  loginValidator,
} = require("../Middleware/inputValidator");
const userController = require("../Controllers/userController");
const { validateToken } = require("../Middleware/auth");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for user authentication
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          username:
 *            type: string
 *          password:
 *            type: string
 *          name:
 *            type: string
 */
/**
 * @swagger
 * /user/register:
 *  post:
 *    tags: [User]
 *    summary: Register user
 *    description: This api is used to Register user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      200:
 *        description: Register successfully
 */
router.post("/register", registerValidator, userController.register);
router.post("/login", loginValidator, userController.login);
router.post("/logout", validateToken, loginValidator, userController.logout);

module.exports = router;
