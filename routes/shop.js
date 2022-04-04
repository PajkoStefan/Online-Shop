// import packages
const express = require('express');

// import controllers
const shopController = require('../controllers/shop');

// router
const router = express.Router();

// routes
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);


module.exports = router;