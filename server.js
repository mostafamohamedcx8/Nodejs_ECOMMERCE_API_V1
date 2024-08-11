const path = require("path");
const cors = require("cors");
const compression = require("compression");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const GlobalError = require("./middleware/errorMiddleware");
const dbconnection = require("./config/database");
const MountRoutes = require("./routes");
const WebhookCheckout = require("./services/orderservice");

// connection with db
dbconnection();

// express app
const app = express();
// Enable other domines
app.use(cors());
app.options("*", cors());

// Enable gzip compression for responses
app.use(compression());

// checkout session
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  WebhookCheckout
);

// middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// eslint-disable-next-line eqeqeq
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
MountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find thos route: ${req.originalUrl}`, 400));
});
//Global error handling middleware
app.use(GlobalError);

const { PORT } = process.env;

const server = app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});

// Handel rejection error outside exprees
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
