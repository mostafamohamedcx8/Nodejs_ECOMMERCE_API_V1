// module that defines the routes related to brands using the Express.js framework.
const express = require("express");
const authService = require("../services/authService");

const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deletCoupon,
} = require("../services/couponservice");

const router = express.Router();
router.use(authService.protect, authService.allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deletCoupon);

module.exports = router;
