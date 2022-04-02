
// import class
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('./admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('./admin/products', {
            pageTitle: 'Admin Products',
            path: '/admin/products',
            prods: products
        });

    });
};

exports.postAddProduct = (req, res, next) => {
    const reqBody = req.body;
    const product = new Product(
        reqBody.title, 
        reqBody.imageUrl,
        reqBody.description,
        reqBody.price
    );
    product.save();
    res.redirect('/');
};
