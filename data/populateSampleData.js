const dotenv = require('dotenv');
const fs = require('fs');
const debug = require('debug')('PropertyExplorer');

dotenv.config({ path: __dirname + '/../variables.env' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise; // use ES6 promises in Mongoose

const Property = require('../models/Property');

const properties = JSON.parse(fs.readFileSync(__dirname + '/properties.json', 'utf-8'));

async function deleteData() {
  debug('Removing data');
  await Property.remove();
  debug('Data successfully removed');
  process.exit();
}

async function populateSampleData() {
  try {
    await Property.insertMany(properties);
    debug('Sample data populated!');
    process.exit();
  } catch (e) {
    debug(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  populateSampleData();
}
