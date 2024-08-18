const path = require("path");
const cors = require("cors");
const compression = require("compression");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const GlobalError = require("./middleware/errorMiddleware");
const dbconnection = require("./config/database");
const MountRoutes = require("./routes");
const { WebhookCheckout } = require("./services/orderservice");

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
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// To remove data using these defaults:
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many requests, please try again later.",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

// selects the last parameter value.
// app.use(hpp());

app.use(hpp({ whitelist: ["price"] }));

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
