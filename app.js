// import packages
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

// helpers & handlers
const rootDir = require("./util/path");
const publicPathHandler = path.join(rootDir, "public");
const sequelize = require("./util/database");

// import models
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

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
  // find the user, store it in the request and call next
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// routes
// import routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { setFlagsFromString } = require("v8");

// enable routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Associations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

//sequelize
sequelize
  // .sync({force: true})
  .sync()
  .then((result) => {
    // console.log(result);
    // make sure to have at least 1 user //dummy code;
    return User.findByPk(1);
  })
  .then((user) => {
    // user created
    if (!user) {
      User.create({ name: "Stefan", email: "stefansemail@maill.com" });
    }
    // return Promise.resolve(user);
    return user;
  })
  .then((user) => {
    // cart created
    return user.createCart();
  })
  .then(cart => {
    // create and start the server
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
