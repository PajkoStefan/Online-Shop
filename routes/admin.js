// import packages
const express = require('express');
const path = require('path');

const pathHandler = path.join(__dirname, '../', 'views', 'add-product.html');

// import router
const router = express.Router();

// routes

// /admin/add-product => GET / because of filtering
router.get("/add-product", (req, res, next) => {
    res.sendFile(pathHandler, err =>{
        console.log(err);
    });
});

// /admin/add-product => POST / because of filtering
router.post("/add-product", (req, res, next) => {
    res.redirect('/');
});


module.exports = router;