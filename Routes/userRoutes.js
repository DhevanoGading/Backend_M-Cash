const express = require("express");
const router = new express.Router();
const {
  registerValidator,
  loginValidator,
} = require("../Middleware/inputValidator");
const userController = require("../Controllers/userController");
const { validateToken } = require("../Middleware/auth");

router.post("/register", registerValidator, userController.register);
router.post("/login", loginValidator, userController.login);
router.post("/logout", validateToken, loginValidator, userController.logout);

module.exports = router;
