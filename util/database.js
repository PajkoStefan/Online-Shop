const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const mongoConnect = (callback) => {
  const uri = `mongodb+srv://${process.env.MDBUSERNAME}:${process.env.MDBPASSWORD}@cluster0.shs4r.mongodb.net/?retryWrites=true&w=majority`;

  MongoClient.connect(uri)
    .then((client) => {
      console.log("============================ Connected ============================");
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;