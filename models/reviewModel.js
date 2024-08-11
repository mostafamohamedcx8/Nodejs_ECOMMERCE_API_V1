const mongoose = require("mongoose");

const Product = require("./productModel");

const reviewschema = new mongoose.Schema(
  {
    title: { type: String },
    rating: {
      type: Number,
      min: [1, "min rating value is 1.0"],
      max: [5, "max rating value is 5.0"],
      required: [true, "review rating required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewschema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewschema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    {
      // get all reviews on specific product
      $match: { product: productId },
    },
    {
      // group reviews by product and calc avg rating and quantity
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].averageRating,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewschema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

// reviewschema.post("deleteOne", async function () {
//   await this.constructor.calcAverageRatingsAndQuantity(this.product);
// });
reviewschema.post(
  "deleteOne",
  { document: true, query: false },
  async (doc) => {
    await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
  }
);
module.exports = mongoose.model("Review", reviewschema);
