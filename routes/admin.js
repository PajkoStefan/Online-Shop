// import packages
const express = require('express');

const adminController = require('../controllers/admin');

// import router
const router = express.Router();

// routes

// /admin/add-product => GET / because of filtering
router.get("/add-product", adminController.getAddProduct);

// /admin/products => GET / because of filtering
router.get("/products", adminController.getProducts);

// /admin/add-product => POST / because of filtering
router.post("/add-product", adminController.postAddProduct);


module.exports = router;