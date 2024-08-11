// module that defines the routes related to brands using the Express.js framework.
const express = require("express");
const authService = require("../services/authService");

const {
  getBrandValidator,
  createBrandValidator,
  deletBrandValidator,
  updateBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deletBrand,
  UploadBrandImage,
  resizeimage,
} = require("../services/brandservice");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    UploadBrandImage,
    resizeimage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    UploadBrandImage,
    resizeimage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deletBrandValidator,
    deletBrand
  );

module.exports = router;
