// import packages
const express = require("express");

// controller
const adminController = require("../controllers/admin");

// middleware
const isAuth = require("../middleware/is-auth");

// import router
const router = express.Router();

// routes

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product/", isAuth, adminController.postEditProduct);

router.post("/delete-product/", isAuth, adminController.postDeleteProduct);

module.exports = router;
