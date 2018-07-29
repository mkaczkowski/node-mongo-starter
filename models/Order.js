const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const orderSchema = new mongoose.Schema({
  item:{
    type:mongoose.Schema.ObjectId,
    ref:'Item',
    required:'You must specify an item'
  },
  quantity: {
    type: Number,
    min: 1,
    max: 99,
    default: 1,
  },
  customer:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:'You must specify the customer'
  },
  status: {
    type: String,
    default: "new",
  },
  created:{
    type:Date,
    default: Date.now
  },
  updated:{
    type:Date,
    default: Date.now
  },
});

orderSchema.pre('save', async function(next) {
  // this.updated = new Date.now();
  next();
});

function autopopulate(next) {
  this.populate('item');
  next();
}

orderSchema.pre('find', autopopulate);
orderSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Order', orderSchema);
