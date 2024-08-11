const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

const calcTotalCartprice = (cart) => {
  let totalPrice = 0;
  cart.cartitems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.Totalpricecart = totalPrice;
  cart.TotalpriceAfterDiscount = undefined;
  return totalPrice;
};

// desc Create Cart
// route Post /api/vi/Carts
// access Private/User

exports.AddProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  // 1)get cart for logged User
  let cart = await Cart.findOne({ user: req.user._id });
  // 2)create create for user
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartitems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart update quantity
    const productexist = cart.cartitems.findIndex(
      (item) => item.product.toString() == productId && item.color == color
    );
    if (productexist > -1) {
      const CartItem = cart.cartitems[productexist];
      CartItem.quantity += 1;
      cart.cartitems[productexist] = CartItem;
    } else {
      // if product not exist add to cartItems array
      cart.cartitems.push({ product: productId, color, price: product.price });
    }
  }

  // 3) update total price in cart
  calcTotalCartprice(cart);

  await cart.save();

  res.status(200).json({
    success: true,
    IndexOfCartItems: cart.cartitems.length,
    data: cart,
  });
});

// desc get Cart
// route get /api/vi/Carts
// access Private/User
exports.GetLogggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }
  res.status(200).json({
    success: true,
    IndexOfCartItems: cart.cartitems.length,
    data: cart,
  });
});

// desc delet specific itemCart
// route put /api/vi/Carts/:itemid
// access Private/User
exports.DeleteCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartitems: { _id: req.params.itemId } } },
    { new: true }
  );
  // 3) update total price in cart
  calcTotalCartprice(cart);

  await cart.save();

  res.status(200).json({
    success: true,
    IndexOfCartItems: cart.cartitems.length,
    data: cart,
  });
});

// desc delet Cart
// route delet /api/vi/Carts
// access Private/User
exports.ClearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
});

// desc update specific itemCart Quantity
// route put /api/vi/Carts/:itemid
// access Private/User
exports.UpdateItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(`Cart not found for that User ${req.user._id}`, 404);
  }
  const itemindex = cart.cartitems.findIndex(
    (item) => item._id.toString() == req.params.itemId
  );
  if (itemindex > -1) {
    const CartItem = cart.cartitems[itemindex];
    CartItem.quantity = quantity;
    cart.cartitems[itemindex] = CartItem;
  } else {
    return next(
      new ApiError(`there not found that item ${req.params.itemId} `)
    );
  }
  calcTotalCartprice(cart);
  await cart.save();
  res.status(200).json({
    success: true,
    IndexOfCartItems: cart.cartitems.length,
    data: cart,
  });
});

// desc Apply coupon on logged user cart
// route put /api/vi/Carts/applycoupon
// access Private/User

exports.applycoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.name,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon not found", 404));
  }
  const cart = await Cart.findOne({ user: req.user._id });
  const totalprice = cart.Totalpricecart;

  const totalpriceAfterdiscount = (
    totalprice -
    (totalprice * coupon.discount) / 100
  ).toFixed(2);
  cart.TotalpriceAfterDiscount = totalpriceAfterdiscount;
  await cart.save();
  res.status(200).json({
    success: true,
    IndexOfCartItems: cart.cartitems.length,
    data: cart,
  });
});
