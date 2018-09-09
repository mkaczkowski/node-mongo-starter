// const googleMapsClient = require('@google/maps');

// googleMapsClient.createClient({
//   key: process.env.GOOGLE_MAPS_API_KEY,
//   Promise: global.Promise,
// });

module.exports.getCoordinatesFromAddress = async address => {
  // const geoResponse = await googleMapsClient
  //   .geocode({
  //     address,
  //     // components: {
  //     //   route: 'Macquarie St',
  //     //   locality: 'Sydney',
  //     //   postal_code: '2000',
  //     //   country: 'Australia'
  //     // }
  //   })
  //   .asPromise();
  // console.log(geoResponse.json.results);

  const coordinates = [1,1];
  return coordinates;
};
