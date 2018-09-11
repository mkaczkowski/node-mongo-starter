const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandlers = require('./handlers/errorHandlers');
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// routes
app.use('/api', require('./routes'));

// errors
app.use(errorHandlers.notFound);
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}
app.use(errorHandlers.productionErrors);

module.exports = app;
