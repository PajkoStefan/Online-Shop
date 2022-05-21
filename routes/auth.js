// import packages
const express = require('express');

// controller
const authController = require('../controllers/auth');

// import router
const router = express.Router();

router.get("/login", authController.getLogin);

module.exports = router;