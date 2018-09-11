const googleMaps = require('@google/maps');

let googleMapsClient;

const createMapsClient = () => {
  googleMapsClient = googleMaps.createClient({
    key: process.env.GOOGLE_API_KEY,
    Promise: global.Promise,
  });
};

const getAddressString = address => {
  const addressPiecies = [address.line1, address.line2, address.line3, address.line4, address.city];
  return addressPiecies.reduce((prev, current) => {
    const currentString = current ? ` ${current}` : '';
    return `${prev}${currentString}`;
  });
};

module.exports.getCoordinatesFromAddress = async address => {
  let coordinates;
  try {
    if (googleMapsClient) createMapsClient();
    const addressString = getAddressString(address);
    const geoResponse = await googleMapsClient
      .geocode({
        address: addressString
      })
      .asPromise();

    // debug(JSON.stringify(geoResponse.json.results[0].geometry.location));
    const results = geoResponse.json.results;
    if (results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      coordinates = [lat, lng];
    }
  } catch (err) {
    console.error(err);
  }
  return coordinates;
};

createMapsClient();
