const { redirect } = require("express/lib/response");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("./shop/index", {
        pageTitle: "Shop",
        path: "/",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("./shop/product-list", {
        pageTitle: "All Products",
        path: "/products",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
      res.render("./shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  //   another approach
  //   Product.findAll( {where: { id: productId }} )
  //   .then((products) => {
  //       res.render("./shop/product-detail", {
  //         pageTitle: products[0].title,
  //         path: "/products",
  //         product: products[0],
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((cartProducts) => {
          res.render("shop/cart", {
            pageTitle: "Your Cart",
            path: "/cart",
            products: cartProducts,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("./shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("./shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
