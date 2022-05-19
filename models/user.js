const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const objectIdConvertor = (userId) => {
  return new mongodb.ObjectId(userId);
};
class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users")
    .find({ _id: objectIdConvertor })
    .next()
    .then((user) => {
        console.log("user");
        console.log(user);
        return user;
    }).catch((err) => {
        console.log(err);
    });;
  }
}

module.exports = User;
