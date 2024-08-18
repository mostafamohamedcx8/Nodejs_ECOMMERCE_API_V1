const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// desc Add product to wishlist
// route Post /api/vi/wishlist
// access protected/user
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product added successfully",
    data: user.wishlist,
  });
});

// desc Remove product from wishlist
// route Post /api/vi/wishlist/productid
// access protected/user
exports.removeProductfromWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "product removed successfully",
    data: user.wishlist,
  });
});

// desc get logged user wishlist
// route Post /api/vi/wishlist
// access protected/user

exports.getloggestuserwishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
