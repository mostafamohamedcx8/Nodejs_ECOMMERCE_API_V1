const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const { uploadMixOfImages } = require("../middleware/uploadimageMiddleware");
const Product = require("../models/productModel");
const Factory = require("./handlerFactory");

exports.UploadProductImage = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  { name: "image", maxCount: 5 },
]);

exports.resizeproductimage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const ImageCoverFilename = `Broducts-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1335)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/Broducts/${ImageCoverFilename}`);

    req.body.imageCover = ImageCoverFilename;
  }

  if (req.files.image) {
    req.body.image = [];
    await Promise.all(
      req.files.image.map(async (img, index) => {
        const ImageName = `Broducts-${uuidv4()}-${Date.now()}-${index}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1335)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/Broducts/${ImageName}`);

        req.body.image.push(ImageName);
      })
    );
    next();
  }
});

// desc get list of products
// route get /api/v1/products
// access Public
exports.getProducts = Factory.getAll(Product, "products");

// desc get sepific Product by id
// route get /api/vi/Products/:id
// access Public
exports.getProduct = Factory.getOne(Product, "reviews");

// desc Create product
// route Post /api/vi/Products
// access Private
exports.createProduct = Factory.createOne(Product);

// desc Update speciface product
// route Put /api/vi/products/:id
// access Private
exports.updateProduct = Factory.updateOne(Product);

// desc delet speciface product
// route Delete /api/vi/products/:id
// access Private
exports.deletProduct = Factory.DeletOne(Product);
