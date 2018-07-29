const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandlers = require('./handlers/errorHandlers');

//SESSION ------
const session = require('express-session');
const mongoose = require('mongoose');
const MongoOrder = require('connect-mongo')(session);
const passport = require('passport');

require('./handlers/passport');

// create our Express app
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions allow us to order data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  order: new MongoOrder({ mongooseConnection: mongoose.connection }),
  cookie : {
    maxAge: 604800000 //7 days in miliseconds
  }
}));

// // Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// pass variables to all requests
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// define routes
app.use('/', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/items', require('./routes/items'));
app.use('/orders', require('./routes/orders'));


app.use(errorHandlers.notFound);
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}
app.use(errorHandlers.productionErrors);

module.exports = app;
