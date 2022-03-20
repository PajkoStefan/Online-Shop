// import packages
const express = require('express');

const productsController = require('../controllers/products');

// import router
const router = express.Router();

// routes

// /admin/add-product => GET / because of filtering
router.get("/add-product", productsController.getAddProduct );

// /admin/add-product => POST / because of filtering
router.post("/add-product", productsController.postAddProduct);


module.exports = router;