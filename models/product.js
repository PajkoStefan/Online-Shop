const fs = require('fs');
const path = require('path');

const rootDirHelper = require('../util/path');
const productsFilePath = path.join(
    rootDirHelper,
    'data',
    'products.json');

// Helper functions
const getProductsFromFile = cb => {
    fs.readFile(productsFilePath, (err, fileContent) => {
        if (err || fileContent.length === 0) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(productsFilePath, JSON.stringify(products), err => {
                if (err)
                    console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }

}