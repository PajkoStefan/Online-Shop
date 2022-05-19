// import needed classes
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("./admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddProduct = (req, res, next) => {
  const reqBody = req.body;

  const product = new Product(
    reqBody.title,
    reqBody.price,
    reqBody.description,
    reqBody.imageUrl,
    null,
    req.user._id
  );

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
  const product = new Product(
    reqBody.title,
    reqBody.price,
    reqBody.description,
    reqBody.imageUrl,
    productId
  );
  return product
    .save()
    .then((result) => {
      console.log("Updated Product!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
    .then((result) => {
      console.log("Destroyed Product!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
