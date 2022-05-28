const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false); // fixeds error:  DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
const dotenv = require("dotenv"); // Hides my DB passw login
const cookieParser = require("cookie-parser");
dotenv.config();
app.use(cors());
const nodemailer = require("nodemailer");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});
app.use(cookieParser());
var bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//start server
const dbUrl = process.env.DB_CONNECT;
const PORT = process.env.PORT || 4000;
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => app.listen(PORT))
  .catch((err) => {
    console.log("error", err);
  });

//Middleware
app.use(express.json()); //Gledai tova da e predi routes shtot ne bachka

//import ROuters
const userRoute = require("./routes/userRoutes");

const testRoute = require("./routes/testRoute");
const productsRoute = require("./routes/productRoutes");
const paymentRoute = require("./routes/paymentRoutes");
// Use Routes
app.use("/api/user", userRoute);
app.use("/api/test", testRoute);
app.use("/api/products", productsRoute);
app.use("/uploads", express.static("uploads"));
app.use("/api/payment", paymentRoute);


