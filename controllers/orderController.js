const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.createOrder = async (req, res) => {
  if(req.user) req.body.customer = req.user._id;
  const order = new Order(req.body);
  await order.save();
  res.json(order);
};

exports.updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the new item instead of the old one
    runValidators: true,
  }).exec();
  res.json(order);
};

exports.deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id);
  res.send(order ? 200 : 404);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id }).populate('author');
  res.json(order);
};

/*
  Validation
*/
exports.validateOrder = async (req, res, next) => {
  req.checkBody('item', 'You must supply an item!').notEmpty();
  req.checkBody('customer', 'You must supply a customer!').notEmpty();
  const validationResult = await req.getValidationResult();
  const errors = validationResult.array();
  if (errors && errors.length > 0) {
    next(errors);
    return;
  }
  next();
};
