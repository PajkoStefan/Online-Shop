// import packages
const db = require('../util/database');

const Cart = require('./cart');


// helper functions


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
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUE (?, ?, ?, ?)', 
        [this.title, this.price, this.imageUrl, this.description]);
    }

    static deleteById(id) {

    }

    // fetch all products
    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    // find product by Id
    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }


}