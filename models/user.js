const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const objectIdConvertor = (id) => {
  return new mongodb.ObjectId(id);
};
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  //   embedded
  addToCart(product) {
    const db = getDb();
    const cartProductIndex = this.cart.items.findIndex((cartProduct) => {
      return cartProduct.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: objectIdConvertor(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    // override the cart
    db.collection("users").updateOne(
      { _id: objectIdConvertor(this._id) },
      { $set: { cart: updatedCart } }
    );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => {
      return item.productId;
    });

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((cartItem) => {
              return cartItem.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteItemFromCart(productId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });

    return db
      .collection("users")
      .updateOne(
        { _id: objectIdConvertor(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: objectIdConvertor(userId) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
