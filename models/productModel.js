const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title required"],
      trim: true,
      minlength: [3, "Too short Product Title"],
      maxlength: [100, "too long Product Title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description required"],
      minlength: [20, "Too short Product Description"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price required"],
      trim: true,
      max: [200000, "too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    color: [String],

    imageCover: {
      type: String,
      required: [true, "Image Cover required"],
    },
    image: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Category required"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

// mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/Broducts/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.image) {
    const imageList = [];
    doc.image.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/Broducts/${image}`;
      imageList.push(imageUrl);
    });
    doc.image = imageList;
  }
};

// findOne, findAll, Update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Product", productSchema);
