// import packages
const express = require("express");

// controller
const authController = require("../controllers/auth");

// import router
const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

module.exports = router;
