const mongoose = require('mongoose');
const { getCoordinatesFromAddress } = require('../utils/maps');
mongoose.Promise = global.Promise;

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
      required: 'Please specify an owner',
    },
    address: {
      type: new mongoose.Schema({
        line1: {
          type: String,
          required: 'Please specify a line1',
        },
        line2: String,
        line3: String,
        line4: {
          type: String,
          required: 'Please specify a line4',
        },
        postCode: {
          type: String,
          required: 'Please specify a post code',
        },
        city: {
          type: String,
          required: 'Please specify a city',
        },
        country: {
          type: String,
          required: 'Please specify a country',
        },
      }),
      required: true,
    },
    incomeGenerated: {
      type: Number,
      min: 0,
      max: 99999999,
      default: 0,
      required: 'Please specify an income generated',
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
propertySchema.pre('save', async next => {
  const coordinates = await getCoordinatesFromAddress(this.address);
  this.location = {
    type: 'Point',
    coordinates: coordinates,
  };
  next();
});

propertySchema.statics.getPropertiesByCoordinates = function(long, lat) {
  return this.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [long, lat],
        },
        spherical: true,
        distanceField: 'distance',
        maxDistance: 20000,
      },
    },
    { $sort: { distance: 1 } },
  ]);
};

module.exports = mongoose.model('Property', propertySchema);
