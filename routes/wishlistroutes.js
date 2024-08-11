// module that defines the routes related to brands using the Express.js framework.
const express = require("express");
const authService = require("../services/authService");

const {
  addProductToWishList,
  removeProductfromWishList,
  getloggestuserwishlist,
} = require("../services/WishListservice");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addProductToWishList).get(getloggestuserwishlist);

router.delete("/:productId", removeProductfromWishList);

module.exports = router;
