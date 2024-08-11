const categoryroute = require("./categoryroutes");
const subCategoryroute = require("./subCategoeyRoute");
const brandroute = require("./brandroutes");
const productroute = require("./productroutes");
const userroute = require("./userRoutes");
const authroute = require("./authRoutes");
const reviewroute = require("./reviewroutes");
const wishlistroute = require("./wishlistroutes");
const addressroute = require("./addressroutes");
const couponroute = require("./couponroutes");
const cartroute = require("./cartroutes");
const orderroute = require("./orderroutes");

const MountRoutes = (app) => {
  app.use("/api/v1/categories", categoryroute);
  app.use("/api/v1/subcategories", subCategoryroute);
  app.use("/api/v1/brands", brandroute);
  app.use("/api/v1/products", productroute);
  app.use("/api/v1/users", userroute);
  app.use("/api/v1/auth", authroute);
  app.use("/api/v1/reviews", reviewroute);
  app.use("/api/v1/wishlist", wishlistroute);
  app.use("/api/v1/address", addressroute);
  app.use("/api/v1/coupons", couponroute);
  app.use("/api/v1/carts", cartroute);
  app.use("/api/v1/orders", orderroute);
};

module.exports = MountRoutes;
