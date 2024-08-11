const express = require("express");
const authService = require("../services/authService");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deletSubCategory,
  SetCategoryIdToBody,
  CreateFilterObject,
} = require("../services/subCategoryservice");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deletSubCategoryValidator,
} = require("../utils/validators/subcategoryValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    SetCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(CreateFilterObject, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deletSubCategoryValidator,
    deletSubCategory
  );

module.exports = router;
