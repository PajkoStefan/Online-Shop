// import packages
const express = require('express');
const path = require('path');

// import helpers
const rootDir = require('../util/path');

// import the data
const adminData = require('./admin');

// helpers
const pathHandler = path.join(rootDir, 'views', 'shop.html');

// router
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
    console.log('shop.js: ', adminData.products);
    res.render('shop', {
        pageTitle: 'Shop',
        path: '/',
        prods: adminData.products,
    });
});

module.exports = router;