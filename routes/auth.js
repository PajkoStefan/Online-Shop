const express = require("express");

const authController = require("../controllers/auth");

// middlewares
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignUp);

router.get("/reset-password", authController.getResetPassword);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignUp);

router.post("/logout", isAuth, authController.postLogout);

module.exports = router;
