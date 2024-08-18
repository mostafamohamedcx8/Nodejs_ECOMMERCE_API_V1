const express = require("express");

const {
  createReviewValidator,
  deletReviewValidator,
  updateReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deletReview,
  CreateFilterObject,
  SetproductIdandUserIdToBody,
} = require("../services/reviewservice");

const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(CreateFilterObject, getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    SetproductIdandUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "user", "manager"),
    deletReviewValidator,
    deletReview
  );

module.exports = router;
