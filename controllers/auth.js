exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req
  //   .get("Cookie")
  //   .split(";")
  //   .map((item) => {
  //     return item.split("=")[0].trim() === "loggedIn"
  //       ? item.split("=")[1].trim()
  //       : false;
  //   })[0] === 'true';
console.log(req.session.isLoggedIn);
  res.render("./auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};


