// import needed classes
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('./admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false  
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

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId, product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('./admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};


exports.postAddProduct = (req, res, next) => {
    const reqBody = req.body;
    console.log(reqBody);
    const product = new Product(
        null,
        reqBody.title,
        reqBody.imageUrl,
        reqBody.description,
        reqBody.price  
    );

    product.save(product);
    res.redirect('/');
};


exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const reqBody = req.body;
    const updatedProduct = new Product(
        productId,
        reqBody.title,
        reqBody.imageUrl,
        reqBody.description,
        reqBody.price
    );
    updatedProduct.save();
    res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect('/admin/products')
}


