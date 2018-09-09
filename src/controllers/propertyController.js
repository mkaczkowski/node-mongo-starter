const mongoose = require('mongoose');
const Property = mongoose.model('Property');
const { check } = require('express-validator/check');

module.exports.getProperties = async (req, res) => {
  const properties = await Property.find();
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

module.exports.getPropertiesByLatitude = async (req, res) => {
  const location = req.params.location;
  const properties = await Property.getItemsByLocation(0, 0);
  res.json(properties);
};

module.exports.getPropertiesByLocation = async (req, res) => {
  const location = req.params.location;
  const long = 0;
  const latt = 0;
  const properties = await Property.find({
    location: {
      $near: {
        $maxDistance: 1000,
        $geometry: {
          type: 'Point',
          coordinates: [long, latt],
        },
      },
    },
  }).exec();
  res.json(properties);
};

/*
  Validation
*/
//TODO
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
