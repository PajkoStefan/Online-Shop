// import packages
const express = require('express');

// import controllers
const productsController = require('../controllers/products');

// router
const router = express.Router();

// routes
router.get('/', productsController.getProducts);

module.exports = router;