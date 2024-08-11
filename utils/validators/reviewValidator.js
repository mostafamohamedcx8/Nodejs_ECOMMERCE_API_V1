const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("rating is reqire")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating is must be between 1 to 5"),
  check("user").isMongoId().withMessage("invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("invalid product id format")
    .custom((val, { req }) =>
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("user has already reviewed this product")
            );
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom((val, { req }) =>
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(`there no review with that id ${val}`)
          );
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`you not allowed for U to do that action`)
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deletReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Brand id format")
    .custom((val, { req }) => {
      if (req.user.role == "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`there no review with that id ${val}`)
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`you not allowed for U to do that action`)
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
