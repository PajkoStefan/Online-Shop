// import needed classes
const Product = require("../models/product");

const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("./admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    hasError: false,
    editing: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.getProducts = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("./admin/products", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("./admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        hasError: false,
        editing: editMode,
        product: product,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddProduct = (req, res, next) => {
  const reqBody = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("./admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: reqBody.title,
        price: reqBody.price,
        description: reqBody.description,
        imageUrl: reqBody.imageUrl,
        _id: reqBody.productId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title: reqBody.title,
    price: reqBody.price,
    description: reqBody.description,
    imageUrl: reqBody.imageUrl,
    userId: req.user, // or req.user._id
  });

  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const reqBody = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("./admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: reqBody.title,
        price: reqBody.price,
        description: reqBody.description,
        imageUrl: reqBody.imageUrl,
        _id: productId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = reqBody.title;
      product.price = reqBody.price;
      product.description = reqBody.description;
      product.imageUrl = reqBody.imageUrl;
      return product.save().then((result) => {
        console.log("Updated Product!");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.redirect("/");
      }
      console.log("Destroyed Product!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
