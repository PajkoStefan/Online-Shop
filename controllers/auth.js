const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("./auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = false;
  User.findById("6287f0e369a8e90df7b017c4")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
