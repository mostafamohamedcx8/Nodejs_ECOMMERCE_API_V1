const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const Factory = require("./handlerFactory");
const Order = require("../models/orderModel");
const ApiError = require("../utils/apiError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// @desc create cash order
// @route post /api/v1/orders/cartId
// @access protected/user
exports.CreateOrder = asyncHandler(async (req, res, next) => {
  const taxprice = 0;
  const shippingprice = 0;
  // 1)GET cart depend on cardId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`no Cart with this Id ${req.params.cartId}`, 404));
  }
  // 2)Get order price depend on cart price "check if coupon apply"
  const cartprice = cart.TotalpriceAfterDiscount
    ? cart.TotalpriceAfterDiscount
    : cart.Totalpricecart;
  const totalorderprice = cartprice + shippingprice + taxprice;
  // 3)Create order with defualt paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartitems,
    shippingAddress: req.body.shippingAddress,
    totalorderprice,
  });
  // 4)After creating order, decrement prodct quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartitems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    // 5)Clear cart depend on cardId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ success: true, data: order });
});

exports.FilterOpjForLOggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc get all order
// @route get /api/v1/orders
// @access protected/user-Admin-Manager
exports.FindAllOrders = Factory.getAll(Order);

// @desc specific order
// @route get /api/v1/orders/orderId
// @access protected/user-Admin-Manager
exports.FindSpecificOrders = Factory.getOne(Order);

// @desc update order to paid
// @route get /api/v1/orders/Id/pay
// @access protected/Admin-Manager
exports.UpdateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError(`No order with this ID ${req.params.id}`, 404));
  }
  order.ispaid = true;
  order.paidAt = Date.now();

  const UpdateOrder = await order.save();
  res.status(200).json({ success: true, data: UpdateOrder });
});

// @desc update order to delivered
// @route get /api/v1/orders/Id/deliver
// @access protected/Admin-Manager
exports.UpdateOrderTodelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError(`No order with this ID ${req.params.id}`, 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const UpdateOrder = await order.save();
  res.status(200).json({ success: true, data: UpdateOrder });
});

// @desc Get checkOut from Stripe and send it as response
// @route get /api/v1/orders/checkout-session/cartId
// @access protected/User
exports.CheckOutSession = asyncHandler(async (req, res, next) => {
  const taxprice = 0;
  const shippingprice = 0;
  // 1)GET cart depend on cardId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`no Cart with this Id ${req.params.cartId}`, 404));
  }
  // 2)Get order price depend on cart price "check if coupon apply"
  const cartprice = cart.TotalpriceAfterDiscount
    ? cart.TotalpriceAfterDiscount
    : cart.Totalpricecart;
  const totalorderprice = cartprice + shippingprice + taxprice;
  // 3)Create Stripe checkout session
  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalorderprice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadate: req.body.shoppingAddress,
  });
  res.status(200).json({ success: true, session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderprice = session.amount_total / 100;
  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // Create order with defualt paymentMethodType card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartitems,
    shippingAddress,
    totalorderprice: orderprice,
    paymentMethod: "card",
    ispaid: true,
    paidAt: Date.now(),
  });

  if (order) {
    const bulkOption = cart.cartitems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    await Cart.findByIdAndDelete(cartId);
  }
};

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.WebhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createCardOrder(event.data.object);
  }
  res.status(200).json({ received: true });
});
