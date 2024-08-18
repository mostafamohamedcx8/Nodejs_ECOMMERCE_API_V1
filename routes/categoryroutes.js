// module that defines the routes related to categories using the Express.js framework.
const express = require("express");
// eslint-disable-next-line import/no-extraneous-dependencies

const {
  getCategoryValidator,
  createCategoryValidator,
  deletCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deletCategory,
  UploadCategoriesImage,
  resizeimage,
} = require("../services/categoryservice");

const authService = require("../services/authService");

const subcategoriesRoute = require("./subCategoeyRoute");

const router = express.Router();

// Nested route
router.use("/:categoryId/subcategories", subcategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    UploadCategoriesImage,
    resizeimage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    UploadCategoriesImage,
    resizeimage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deletCategoryValidator,
    deletCategory
  );

module.exports = router;
