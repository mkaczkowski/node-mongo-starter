const dotenv = require('dotenv');
const fs = require('fs');
const debug = require('debug')('Norders');

dotenv.config({ path: __dirname + '/../variables.env' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const User = require('../models/User');
const Item = require('../models/Item');
const Order = require('../models/Order');

const users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'));
const items = JSON.parse(fs.readFileSync(__dirname + '/items.json', 'utf-8'));
const orders = JSON.parse(fs.readFileSync(__dirname + '/orders.json', 'utf-8'));

async function deleteData() {
  debug('Removing data');
  await Order.remove();
  await Item.remove();
  await User.remove();
  debug('Data successfully removed');
  process.exit();
}

async function populateSampleData() {
  try {
    await User.insertMany(users);
    await Item.insertMany(items);
    await Order.insertMany(orders);
    debug('Sample data populated!');
    process.exit();
  } catch(e) {
    debug(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  populateSampleData();
}
