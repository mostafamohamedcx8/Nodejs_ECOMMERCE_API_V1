// module that defines the routes related to Products using the Express.js framework.
const express = require("express");

const {
  getProductValidator,
  createProductValidator,
  deletProductValidator,
  updateProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deletProduct,
  UploadProductImage,
  resizeproductimage,
} = require("../services/productservice");

const router = express.Router();
const authService = require("../services/authService");
const reviewsRoute = require("./reviewroutes");

// Post or Get /products/asfgsgeewf4g5s/reviews

router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    UploadProductImage,
    resizeproductimage,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    UploadProductImage,
    resizeproductimage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deletProductValidator,
    deletProduct
  );

module.exports = router;
