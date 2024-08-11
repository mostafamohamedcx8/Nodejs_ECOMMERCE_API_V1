//module responsible for implementing category-related services,
// particularly handling HTTP requests related to categories.
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Category = require("../models/categorymodel");
const Factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middleware/uploadimageMiddleware");

// upload single image
exports.UploadCategoriesImage = uploadSingleImage("image");

exports.resizeimage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/Categories/${filename}`);

    req.body.image = filename;
  }
  next();
});

// desc get list of categories
// route get /api/v1/categories
// access Public
exports.getCategories = Factory.getAll(Category);

// desc get sepific category by id
// route get /api/vi/categories/:id
// access Public
exports.getCategory = Factory.getOne(Category);

// desc Create category
// route Post /api/vi/categories
// access Private
exports.createCategory = Factory.createOne(Category);

// desc Update speciface category
// route Put /api/vi/categories/:id
// access Private
exports.updateCategory = Factory.updateOne(Category);

// desc delet speciface category
// route Delete /api/vi/categories/:id
// access Private
exports.deletCategory = Factory.DeletOne(Category);
