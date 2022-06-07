// import packages
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

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
const csrfProtection = csrf();

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

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
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

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next ) => {
  res.redirect('/500');
})

// create and start the server
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
