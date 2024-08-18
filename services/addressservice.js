const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// desc Add Address to addresses
// route Post /api/vi/addresses
// access protected/user
exports.addAddressToaddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "address added successfully",
    data: user.addresses,
  });
});

// desc Remove Address from addresses
// route Post /api/vi/addresses Addressid
// access protected/user
exports.removeAddressfromaddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        addresses: { _id: req.params.addressId },
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully",
    data: user.addresses,
  });
});

// desc get logged user addresses
// route Post /api/vi/address
// access protected/user

exports.getloggestuseraddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    data: user.addresses,
  });
});
