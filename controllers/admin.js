// import needed classes
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("./admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

// exports.getProducts = (req, res, next) => {
//   req.user.getProducts()
//     .then((products) => {
//       res.render("./admin/products", {
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//         prods: products,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   const productId = req.params.productId;

//   if (!editMode) {
//     return res.redirect("/");
//   }

//   req.user
//     .getProducts({ where: { id: productId } })
//     // Product.findByPk(productId)
//     // .then((product) => {
//     //   if (!product) {
//     .then((products) => {
//       const product = products[0];
//       if (!product) {
//         return res.redirect("/");
//       }
//       res.render("./admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

exports.postAddProduct = (req, res, next) => {
  const reqBody = req.body;

  const product = new Product(
    reqBody.title,
    reqBody.price,
    reqBody.description,
    reqBody.imageUrl
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

// exports.postEditProduct = (req, res, next) => {
//   const productId = req.body.productId;
//   const reqBody = req.body;
//   Product.findByPk(productId)
//     .then((product) => {
//       console.log(product);
//       product.title = reqBody.title;
//       product.price = reqBody.price;
//       product.description = reqBody.description;
//       product.imageUrl = reqBody.imageUrl;
//       return product.save();
//     })
//     .then((result) => {
//       console.log("Updated Product!");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const productId = req.body.productId;
//   Product.findByPk(productId)
//     .then((product) => {
//       return product.destroy();
//     })
//     .then((result) => {
//       console.log("Destroyed Product!");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
