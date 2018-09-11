const mongoose = require('mongoose');
const Property = mongoose.model('Property');
const { check, query } = require('express-validator/check');
const { sanitizeQuery } = require('express-validator/filter');

const basicFields = 'owner address incomeGenerated location';
const fullFields = '-created_at, -updated_at -__v';

module.exports.getProperties = async (req, res) => {
  let properties;
  if (req.query.hasOwnProperty('longitude') && req.query.hasOwnProperty('latitude')) {
    const { latitude, longitude } = req.query;
    properties = await Property.getPropertiesByCoordinates(latitude, longitude).exec();
  } else {
    properties = await Property.find({}, basicFields).exec();
  }
  res.json(properties);
};

module.exports.getProperty = async (req, res) => {
  const { id } = req.params;
  try{
    const property = await Property.findById(id, fullFields).exec();
    res.json(property);
  }catch(err){
    return res.status(404).json({ err });
  }
};

module.exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const changedProperty = req.body;

  const property = await Property.findByIdAndUpdate(id, changedProperty, {
    new: true,
    runValidators: true,
  })
    .select(basicFields)
    .exec();

  res.json(property);
};

/*
  Validation
*/
module.exports.validateQuery = [
  query('longitude')
    .optional()
    .isDecimal(),
  query('latitude')
    .optional()
    .isDecimal(),
  sanitizeQuery('longitude').toFloat(),
  sanitizeQuery('latitude').toFloat(),
];

module.exports.validateProperty = [
  check('airbnbId').isNumeric(),
  check('owner')
    .isString()
    .not()
    .isEmpty(),
  check('incomeGenerated').isDecimal(),
  check('address').exists(),
  check('address.line1')
    .isString()
    .not()
    .isEmpty(),
  check('address.line2')
    .optional()
    .isString(),
  check('address.line3')
    .optional()
    .isString(),
  check('address.line4')
    .isString()
    .not()
    .isEmpty(),
  check('address.postCode')
    .isString()
    .not()
    .isEmpty(),
  check('address.city')
    .isString()
    .not()
    .isEmpty(),
  check('address.country')
    .isString()
    .not()
    .isEmpty(),
  check('airbnbId').isDecimal(),
  check('numberOfBedrooms')
    .optional()
    .isInt(),
  check('numberOfBathrooms')
    .optional()
    .isInt(),
];
