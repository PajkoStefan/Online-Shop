const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

let _db;

const mongoConnect = (callback) => {
  const uri = `mongodb+srv://${process.env.MDBUSERNAME}:${process.env.MDBPASSWORD}@cluster0.shs4r.mongodb.net/?retryWrites=true&w=majority`;

  MongoClient.connect(uri)
    .then((client) => {
      console.log(
        "============================ Connected ============================"
      );

      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(
        "============================ Error ============================"
      );
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
