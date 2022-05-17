// import packages
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

// helpers & handlers
const rootDir = require("./util/path");
const publicPathHandler = path.join(rootDir, "public");
const mongoConnect = require('./util/database');

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

app.use((req, res, next) => {
  // // find the user, store it in the request and call next
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

// routes
// // import routes
// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

// // enable routes
// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

// create and start the server
mongoConnect((client) => {
  console.log(client);
  app.listen(3000);
})
