// import packages
const express = require('express');


// controllers
const shopController = require('../controllers/shop');

// Router
const router = express.Router();

// routes

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

// router.get('/orders', shopController.getOrders);

router.post('/cart', shopController.postCart);

// router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// router.post('/create-order', shopController.postOrder);


module.exports = router;