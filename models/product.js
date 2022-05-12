// import packages
const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

// import path helper (rootDir)
const rootDirHelper = require('../util/path');

// path to the file
const productsFilePath = path.join(rootDirHelper, 'data', 'products.json');

// helper functions
const getProductsFromFile = cb => {
    fs.readFile(productsFilePath, (err, fileContent) => {
        if (err || fileContent.length === 0) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    // save a new product
    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(productsFilePath, JSON.stringify(updatedProducts), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(productsFilePath, JSON.stringify(products), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(productsFilePath, JSON.stringify(updatedProducts), err =>{
                if(!err){
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    // fetch all products
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    // find product by Id
    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        })
    }


}