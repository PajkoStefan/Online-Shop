// import packages
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// dotenv.config();

// helpers & handlers
const rootDir = require("./util/path");
const publicPathHandler = path.join(rootDir, "public");
// const User = require("./models/user");

// controllers
const errorController = require("./controllers/error");

// initialize express
const app = express();

// set view engine
app.set("view engine", "ejs");
app.set("views", "views");

// enable body parser & static files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPathHandler));

// app.use((req, res, next) => {
  // // find the user, store it in the request and call next
  // User.findById("62864fb4c3c5fca7206f18ab")
  //   .then((user) => {
  //     // console.log(user);
  //     req.user = new User(user.name, user.email, user.cart, user._id);
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
// });

// routes
// // import routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// // enable routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// create and start the server
mongoose
  .connect(
    `mongodb+srv://${process.env.MDBUSERNAME}:${process.env.MDBPASSWORD}@cluster0.shs4r.mongodb.net/shop?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
