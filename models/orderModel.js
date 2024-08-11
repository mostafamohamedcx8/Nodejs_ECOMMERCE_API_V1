const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Oreder must be belong to user"],
    },
    cartItems: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxprice: { type: Number, default: 0 },
    shippingprice: { type: Number, default: 0 },
    totalorderprice: { type: Number },
    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    shipingaddress: {
      details: String,
      phone: String,
      city: String,
      postalcode: String,
    },
    ispaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name imageProfile email phone",
  }).populate({ path: "cartItems.product", select: "title imageCover" });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
