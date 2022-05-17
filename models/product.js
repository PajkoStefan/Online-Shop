const res = require("express/lib/response");
const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const objectIdConvertor = (id) => {
  return new mongodb.ObjectId(id);
};

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? objectIdConvertor(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the product
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // create new product
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp
      .then((result) => {
        console.log("Updated Product");
        console.log(result);
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: objectIdConvertor(productId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(productId) {
    const db = getDb();
    return db.collection("products")
      .deleteOne({ _id: objectIdConvertor(productId) })
      .then((result) => {
        console.log("Product Was Deleted!");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
