const fs = require('fs');
const path = require('path');

const rootDirHelper = require('../util/path');
const cartFilePath = path.join(
    rootDirHelper,
    'data',
    'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(cartFilePath, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            console.log(existingProduct);
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {
                    id: id,
                    qty: 1
                };
                cart.products = [...cart.products, updatedProduct]

            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(cartFilePath, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }



}