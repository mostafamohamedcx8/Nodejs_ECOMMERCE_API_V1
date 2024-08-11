// module that defines the routes related to brands using the Express.js framework.
const express = require("express");
const authService = require("../services/authService");

const {
  AddProductToCart,
  GetLogggedUserCart,
  DeleteCartItem,
  ClearCart,
  UpdateItemQuantity,
  applycoupon,
} = require("../services/cartService");

const router = express.Router();
router.use(authService.protect, authService.allowedTo("user"));
router
  .route("/")
  .post(AddProductToCart)
  .get(GetLogggedUserCart)
  .delete(ClearCart);
router.route("/applycoupon").put(applycoupon);
router.route("/:itemId").delete(DeleteCartItem);
router.route("/:itemId").put(UpdateItemQuantity);
module.exports = router;
