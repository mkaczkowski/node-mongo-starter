const dotenv = require('dotenv');
const fs = require('fs');
const debug = require('debug')('PropertyExplorer');
const Property = require('../src/models/Property');
const { getCoordinatesFromAddress } = require('../src/utils/maps');
const mongoose = require('mongoose');

dotenv.config({ path: __dirname + '/../variables.env' });

mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true }
);

mongoose.Promise = global.Promise; // use ES6 promises in Mongoose

const properties = JSON.parse(fs.readFileSync(__dirname + '/properties.json', 'utf-8'));

async function deleteData() {
  debug('Removing data');
  await Property.remove();
  debug('Data successfully removed');
  process.exit();
}

async function populateSampleData() {
  try {
    if (process.env.GOOGLE_API_DISABLED !== 'true') {
      const propertiesWithLocation = await Promise.all(
        properties.map(async prop => {
          const coordinates = await getCoordinatesFromAddress(prop.address);
          return {
            ...prop,
            location: {
              coordinates,
              type: 'Point',
            },
          };
        })
      );
      await Property.insertMany(propertiesWithLocation);
    } else {
      //only for tests when google maps api is not working / timeout
      await Property.insertMany(properties);
    }

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
