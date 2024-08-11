//module responsible for implementing brand-related services,
// particularly handling HTTP requests related to Brands.
const Factory = require("./handlerFactory");
const Review = require("../models/reviewModel");

exports.CreateFilterObject = (req, res, next) => {
  let filterObject = {};
  // eslint-disable-next-line no-unused-vars
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

exports.SetproductIdandUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};

// desc get list of Reviews
// route get /api/v1/Reviews
// access Public
exports.getReviews = Factory.getAll(Review);

// desc get sepific Review by id
// route get /api/vi/Reviews/:id
// access Public
exports.getReview = Factory.getOne(Review);

// desc Create Review
// route Post /api/vi/Reviews
// access Private/protect/user
exports.createReview = Factory.createOne(Review);

// desc Update speciface Review
// route Put /api/vi/Reviews/:id
// access Private/protect/user
exports.updateReview = Factory.updateOne(Review);

// desc delet speciface Review
// route Delete /api/vi/Reviews/:id
// access Private/protect/user - admin- manager
exports.deletReview = Factory.DeletOne(Review);
