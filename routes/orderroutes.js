// module that defines the routes related to brands using the Express.js framework.
const express = require("express");

const {
  CreateOrder,
  FilterOpjForLOggedUser,
  FindAllOrders,
  FindSpecificOrders,
  UpdateOrderToPaid,
  UpdateOrderTodelivered,
  CheckOutSession,
} = require("../services/orderservice");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.route("/:cartId").post(authService.allowedTo("user"), CreateOrder);
router.get(
  "/",
  authService.allowedTo("user", "admin", "manager"),
  FilterOpjForLOggedUser,
  FindAllOrders
);

router.get(
  "/checkout-session/:cartId",
  authService.allowedTo("user"),
  CheckOutSession
);

router.get("/:id", FindSpecificOrders);

router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  UpdateOrderToPaid
);
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  UpdateOrderTodelivered
);

module.exports = router;
