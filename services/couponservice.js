const Factory = require("./handlerFactory");
const Coupon = require("../models/couponModel");

// desc get list of Coupons
// route get /api/v1/Coupons
// access Private (Admin-manager)
exports.getCoupons = Factory.getAll(Coupon);

// desc get sepific Coupon by id
// route get /api/vi/Coupons/:id
// access Private (Admin-manager)
exports.getCoupon = Factory.getOne(Coupon);

// desc Create Coupon
// route Post /api/vi/Coupons
// access Private (Admin-manager)
exports.createCoupon = Factory.createOne(Coupon);

// desc Update speciface Coupon
// route Put /api/vi/Coupons/:id
// access Private (Admin-manager)
exports.updateCoupon = Factory.updateOne(Coupon);

// desc delet speciface Coupon
// route Delete /api/vi/Coupons/:id
// access Private (Admin-manager)
exports.deletCoupon = Factory.DeletOne(Coupon);
