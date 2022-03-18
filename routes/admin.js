// import packages
const express = require('express');
const path = require('path');

const pathHandler = path.join(__dirname, '../', 'views', 'add-product.html');

// import router
const router = express.Router();

// 
const products = [];

// routes

// /admin/add-product => GET / because of filtering
router.get("/add-product", (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
});

// /admin/add-product => POST / because of filtering
router.post("/add-product", (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect('/');
});


exports.routes = router;
exports.products = products;