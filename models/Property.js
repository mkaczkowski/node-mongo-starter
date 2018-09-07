const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const googleMapsClient = require('@google/maps');
googleMapsClient.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: global.Promise,
});

//   "owner": "elaine",
//   "address": {
// "line1": "4",
// "line2": "332b",
// "line4": "Goswell Road",
// "postCode": "EC1V 7LQ",
// "city": "London",
// "country": "U.K."
// },
// "airbnbId": 12220057,
//   "numberOfBedrooms": 2,
//   "numberOfBathrooms": 2,
//   "incomeGenerated": 1200

var addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  line4: String,
  post: String,
  city: String,
  country: {
    type: String,
    uppercase: true
  }
});


const propertySchema = new mongoose.Schema(
  {
    airbnbId: {
      type: Number,
      unique: true,
      required: true,
    },
    owner: {
      type: String,
      trim: true,
      maxlength: 100,
      required: "Please specify an owner",
    },
    address: {
      type: addressSchema,
      required: true
    },
    incomeGenerated: {
      type: Number,
      min: 0,
      max: 99999999,
      default: 0,
    },
    numberOfBedrooms: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    numberOfBathrooms: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    // email: {
    //   type: String,
    //   unique: true,
    //   lowercase: true,
    //   trim: true,
    //   validate: [validator.isEmail, 'Invalid Email Address'],
    //   required: 'Please Supply an email address'
    // },
    photo: String,
    tags: [String],
    location: {
      type: {
        type: String,
        enum: 'Point',
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Define our indexes
propertySchema.index({
  location: '2dsphere',
});

/**
 * METHODS
 */
propertySchema.pre('save', async function(next) {
  const geoResponse = await googleMapsClient.geocode({
    address: this.address
    // components: {
    //   route: 'Macquarie St',
    //   locality: 'Sydney',
    //   postal_code: '2000',
    //   country: 'Australia'
    // }
  }).asPromise();
  console.log(geoResponse.json.results);

  this.location = {
    type: 'Point',
    coordinates: [-73.97, 40.77],
  };
  next();
});

propertySchema.statics.getItemsByLocation = function(long, lat) {
  return this.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [long, lat],
        },
        distanceField: 'distance',
        spherical: true,
        maxDistance: 10000,
      },
    },
    // { $sort: { count: -1 } },
  ]);
};

module.exports = mongoose.model('Property', propertySchema);
