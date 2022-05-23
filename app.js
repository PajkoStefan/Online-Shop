// import packages
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// helpers & handlers
const rootDir = require("./util/path");
const publicPathHandler = path.join(rootDir, "public");
const User = require("./models/user");

//
const MONGODB_URI = `mongodb+srv://${process.env.MDBUSERNAME}:${process.env.MDBPASSWORD}@cluster0.shs4r.mongodb.net/shop?retryWrites=true&w=majority`;

// controllers
const errorController = require("./controllers/error");

// initialize express
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// set view engine
app.set("view engine", "ejs");
app.set("views", "views");

// enable body parser & static files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPathHandler));
app.use(
  session({
    secret: "secretValue",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  console.log(req.session.isLoggedIn);
  if (req.session.isLoggedIn) {
    console.log(req.session.user);
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } else{
    next();
  }
});

// routes
// // import routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// // enable routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// create and start the server
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: "Stefan",
            email: "stefan@mail.com",
            cart: { items: [] },
          });
          user.save();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
