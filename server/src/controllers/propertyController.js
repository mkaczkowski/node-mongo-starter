const mongoose = require('mongoose');
const Property = mongoose.model('Property');
const { check, query } = require('express-validator/check');
const { sanitizeQuery } = require('express-validator/filter');

module.exports.getProperties = async (req, res) => {
  let properties;
  if (req.query.hasOwnProperty('longitude') && req.query.hasOwnProperty('latitude')) {
    const { latitude, longitude } = req.query;
    properties = await Property.getPropertiesByCoordinates(latitude, longitude);
  } else {
    properties = await Property.find();
  }
  res.json(properties);
};

module.exports.updateProperty = async (req, res) => {
  const { id: airbnbId } = req.params;
  const changedProperty = req.body;
  let property;
  property = await Property.findOneAndUpdate({ airbnbId }, changedProperty, {
    fields: ['-_id', '-numberOfBedrooms', '-numberOfBathrooms', '-location'],
    new: true,
    runValidators: true,
  }).exec();
  res.json(property);
};

/*
  Validation
*/
module.exports.validateQuery = [
  query('longitude').optional().isDecimal(),
  query('latitude').optional().isDecimal(),
  sanitizeQuery('longitude').toFloat(),
  sanitizeQuery('latitude').toFloat()
];

module.exports.validateProperty = [
  check('airbnbId').isNumeric(),
  check('owner').isString().not().isEmpty(),
  check('incomeGenerated').isDecimal(),
  check('address').exists(),
  check('address.line1').isString().not().isEmpty(),
  check('address.line2').optional().isString().not().isEmpty(),
  check('address.line3').optional().isString().not().isEmpty(),
  check('address.line4').isString().isString().not().isEmpty(),
  check('address.postCode').isString().not().isEmpty(),
  check('address.city').isString().not().isEmpty(),
  check('address.country').isString().not().isEmpty(),
];
