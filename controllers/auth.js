exports.getLogin = (req, res, next) => {
  const isLoggedIn = req
    .get("Cookie")
    .split(";")
    .map((item) => {
      return item.split("=")[0].trim() === "loggedIn"
        ? item.split("=")[1].trim()
        : false;
    })[0] === 'true';

  res.render("./auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};


