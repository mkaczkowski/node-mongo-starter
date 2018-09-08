const dotenv = require('dotenv');
dotenv.config({ path: 'variables.env' });
const mongoose = require('mongoose');

require('../src/models/Property');

mongoose.model('Property');

mongoose.Promise = global.Promise; // use ES6 Promise with mongoose
mongoose.connection.on('error', err => {
  // eslint-disable-next-line no-console
  console.error(err.message);
});
