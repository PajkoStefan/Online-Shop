// import packages
const express = require('express');
const path = require('path');

// import helpers
const rootDir = require('../util/path');

// helpers
const pathHandler = path.join(rootDir, 'views', 'shop.html');

// router
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
    res.sendFile(pathHandler, err => {
        console.log(err);
    });
});

module.exports = router;