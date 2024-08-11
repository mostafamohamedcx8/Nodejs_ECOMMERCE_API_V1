const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/categorymodel");
const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Prouduct required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .isLength({ max: 2000 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Prouduct description is required"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Prouduct required")
    .isNumeric()
    .withMessage("priduct price must be a number")
    .isLength({ max: 32 })
    .withMessage("too long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Product priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be array of string"),
  check("imageCover").notEmpty().withMessage("product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Prouduct must belong to category")
    .isMongoId()
    .withMessage("Invalide Id format")
    .custom((categoryid) =>
      Category.findById(categoryid).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id ${categoryid}`)
          );
        }
      })
    ),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("invalid id format")
    .custom((subcategoriesids) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesids } }).then(
        (result) => {
          // eslint-disable-next-line eqeqeq
          if (result.length != subcategoriesids.length || result.length < 1) {
            return Promise.reject(new Error("Invalid subcategories ids"));
          }
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDb = [];
          subcategories.forEach((subcategory) => {
            subCategoriesIdsInDb.push(subcategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDb)) {
            return Promise.reject(
              new Error(`No subcategory for this id in this category`)
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("invalid id format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("invalide id formate"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("invalide id format"),
  validatorMiddleware,
];

exports.deletProductValidator = [
  check("id").isMongoId().withMessage("invalide id format"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
