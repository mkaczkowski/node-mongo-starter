const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Please specify item's name",
  },
  description: {
    type: String,
    trim: true,
  },
  photo: String,
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
});

// Define our indexes
itemSchema.index({
  name: 'text',
  description: 'text',
});

/**
 * METHODS
 */
itemSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

itemSchema.statics.getTopItems = function() {
  return this.aggregate([
    // Lookup Stores and populate their reviews
    { $lookup: { from: 'orders', localField: '_id', foreignField: 'item', as: 'orders' } },
    // filter for only items that have 2 or more reviews
    { $match: { orders: { $exists: true } } },
    // Add the average reviews field
    {
      $project: {
        photo: '$$ROOT.photo',
        name: '$$ROOT.name',
      },
    },
    // limit to at most 10
    { $limit: 10 },
  ]);
};

module.exports = mongoose.model('Item', itemSchema);
