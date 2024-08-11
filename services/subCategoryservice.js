const SubCategory = require("../models/subCategoryModel");
const Factory = require("./handlerFactory");

exports.SetCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.CreateFilterObject = (req, res, next) => {
  let filterObject = {};
  // eslint-disable-next-line no-unused-vars
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// desc Create category
// route Post /api/vi/categories
// access Private
exports.createSubCategory = Factory.createOne(SubCategory);

// desc get list of subcategories
// route get /api/v1/subcategories
// access Public
exports.getSubCategories = Factory.getAll(SubCategory);

// desc get sepific subcategory by id
// route get /api/vi/subcategories/:id
// access Public
exports.getSubCategory = Factory.getOne(SubCategory);

// desc Update speciface subcategory
// route Put /api/vi/categories/:id
// access Private
exports.updateSubCategory = Factory.updateOne(SubCategory);

// desc delet speciface subcategory
// route Delete /api/vi/categories/:id
// access Private
exports.deletSubCategory = Factory.DeletOne(SubCategory);
