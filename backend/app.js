var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const mongoose = require("mongoose");
const initializePassport = require('./passport-config');

var authRouter = require('./routes/auth');
var vendorRouter = require("./routes/vendor");
var productRouter = require("./routes/product");
var cartRouter = require("./routes/cart");
var purchaseRouter = require("./routes/purchase");

var app = express();
initializePassport(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRouter);
app.use("/vendor", vendorRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/purchase", purchaseRouter);

// Error handler for 404
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Error handler for server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

const dev_db_url = process.env.DEV_DB_URL;
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
