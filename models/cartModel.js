const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartitems: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        color: String,
        price: Number,
      },
    ],
    Totalpricecart: Number,
    TotalpriceAfterDiscount: Number,
    user: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timeseries: true }
);

module.exports = mongoose.model("Cart", cartSchema);
