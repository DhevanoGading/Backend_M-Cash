const express = require("express");
const router = express.Router();
const budgetController = require("../Controllers/budgetController");
const { validateToken } = require("../Middleware/auth");

module.exports = router;
