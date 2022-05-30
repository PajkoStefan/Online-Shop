// import packages
const express = require("express");

const { body } = require("express-validator");

// controller
const adminController = require("../controllers/admin");

// middleware
const isAuth = require("../middleware/is-auth");

// import router
const router = express.Router();

// routes

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/add-product",
  isAuth,
  [
    body("title", "Please, enter a valid title.")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("imageUrl").trim().isURL().withMessage("Please, enter a valid URL."),
    body("price").isFloat().withMessage("Please, enter a valid price."),
    body("description")
      .isLength({ min: 15, max: 500 })
      .withMessage("Please, enter a valid description.")
      .trim(),
  ],
  adminController.postAddProduct
);

router.post(
  "/edit-product/",
  isAuth,
  [
    body("title", "Please, enter a valid title.")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("imageUrl").trim().isURL().withMessage("Please, enter a valid URL."),
    body("price").isFloat().withMessage("Please, enter a valid price."),
    body("description")
      .isLength({ min: 15, max: 500 })
      .withMessage("Please, enter a valid description.")
      .trim(),
  ],
  adminController.postEditProduct
);

router.post("/delete-product/", isAuth, adminController.postDeleteProduct);

module.exports = router;
