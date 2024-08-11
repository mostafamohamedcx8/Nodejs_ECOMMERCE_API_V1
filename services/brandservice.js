//module responsible for implementing brand-related services,
// particularly handling HTTP requests related to Brands.
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middleware/uploadimageMiddleware");
const Brand = require("../models/brandmodel");

// upload single image
exports.UploadBrandImage = uploadSingleImage("image");

exports.resizeimage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/Brands/${filename}`);

  req.body.image = filename;

  next();
});

// desc get list of Brands
// route get /api/v1/Brands
// access Public
exports.getBrands = Factory.getAll(Brand);

// desc get sepific brand by id
// route get /api/vi/brands/:id
// access Public
exports.getBrand = Factory.getOne(Brand);

// desc Create brand
// route Post /api/vi/brands
// access Private
exports.createBrand = Factory.createOne(Brand);

// desc Update speciface brand
// route Put /api/vi/brands/:id
// access Private
exports.updateBrand = Factory.updateOne(Brand);

// desc delet speciface brand
// route Delete /api/vi/Brands/:id
// access Private
exports.deletBrand = Factory.DeletOne(Brand);
