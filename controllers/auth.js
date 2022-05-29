const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const { validationResult } = require("express-validator");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: process.env.MAILSENDER_EMAIL,
    pass: process.env.MAILSENDER_PASS,
  },
});

const resetURLPath = "http://localhost:3000/reset-password/";

const redirectToLoginPage = (reqBody, res, errorMsg, validationErrorsParams) => {
  return res.status(422).render("./auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: errorMsg,
    oldInput: {
      email: reqBody.email,
      password: reqBody.password,
    },
    validationErrors: validationErrorsParams,
  });
};

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("./auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("./auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("./auth/reset-password", {
    pageTitle: "Reset Password",
    path: "/reset-password",
    errorMessage: message,
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("./auth/new-password", {
        pageTitle: "New Password",
        path: "/new-password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogin = (req, res, next) => {
  const reqBody = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return redirectToLoginPage(
      reqBody,
      res,
      errors.array()[0].msg,
      errors.array()
    );
    // return res.status(422).render("./auth/login", {
    //   pageTitle: "Login",
    //   path: "/login",
    //   errorMessage: errors.array()[0].msg,
    //   oldInput: {
    //     email: reqBody.email,
    //     password: reqBody.password,
    //   },
    //   validationErrors: errors.array(),
    // });
  }

  User.findOne({ email: reqBody.email })
    .then((user) => {
      if (!user) {
        return redirectToLoginPage(
          reqBody,
          res,
          "Invalid email or password.",
          []
        );
        // return res.status(422).render("./auth/login", {
        //   pageTitle: "Login",
        //   path: "/login",
        //   errorMessage: "Invalid email or password.",
        //   oldInput: {
        //     email: reqBody.email,
        //     password: reqBody.password,
        //   },
        //   validationErrors: [],
        // });
      }

      bcrypt
        .compare(reqBody.password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          return redirectToLoginPage(
            reqBody,
            res,
            "Invalid email or password.",
            []
          );
          // return res.status(422).render("./auth/login", {
          //   pageTitle: "Login",
          //   path: "/login",
          //   errorMessage: "Invalid email or password.",
          //   oldInput: {
          //     email: reqBody.email,
          //     password: reqBody.password,
          //   },
          //   validationErrors: [],
          // });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postSignUp = (req, res, next) => {
  const reqBody = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("./auth/signup", {
      pageTitle: "Sign Up",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: reqBody.email,
        password: reqBody.password,
        confirmPassword: reqBody.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(reqBody.password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: reqBody.email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        from: `Stefan Anastasovski 👻 <${process.env.MAILSENDER_EMAIL}>`, // sender address
        to: reqBody.email, // list of receivers
        subject: "Your account has been successfully created ✔", // Subject line
        text: "Thanks! Your account has been successfully created!", // plain text body
        html: "<b>Thanks! Your account has been successfully created!</b>", // html body
      });
    })
    .then((result) => {
      console.log("The account has been successfully created!");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    console.log("crypto");
    if (err) {
      console.log(err);
      res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        console.log(user);
        if (!user) {
          req.flash("error", "No account found!");
          return res.redirect("/reset-password");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return transporter.sendMail({
          from: `Stefan Anastasovski 👻 <${process.env.MAILSENDER_EMAIL}>`, // sender address
          to: req.body.email, // list of receivers
          subject: "Password Reset ✔", // Subject line
          text: "Thanks! Your account has been successfully created!", // plain text body
          html: `
          <p>You requested a password reset.</p>
          <p>Click this <a href="${resetURLPath}${token}"> link </a> to set a new password.</p>
          `, // html body
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.postNewPassword = (req, res, next) => {
  const reqBody = req.body;
  let resetUser;
  User.findOne({
    resetToken: reqBody.passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: reqBody.userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(reqBody.password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
