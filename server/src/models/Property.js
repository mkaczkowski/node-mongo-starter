const mongoose = require('mongoose');
const { getCoordinatesFromAddress } = require('../utils/maps');
const debug = require('debug')('PropertyExplorer');
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
      line1: {
        type: String,
        required: 'Please specify a line1',
      },
      line2: {
        type: String,
        default: 0,
      },
      line3: {
        type: String,
        default: 0,
      },
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
    //TODO create a virutal field for coordinates
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
propertySchema.pre('findOneAndUpdate', async function(next) {
  if(process.env.GOOGLE_API_DISABLED !== "true"){
    const coordinates = await getCoordinatesFromAddress(this._update.address);
    this._update.location = {
      type: 'Point',
      coordinates,
    };
  }
  next();
});

propertySchema.statics.getPropertiesByCoordinates = function(lat, long) {
  return this.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lat, long],
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
