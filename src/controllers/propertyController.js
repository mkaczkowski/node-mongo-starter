const mongoose = require('mongoose');
const Property = mongoose.model('Property');

module.exports.getProperties = async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
};

module.exports.getPropertyById = async (req, res) => {
  const property = await Property.findOne({ _id: req.params.id });
  res.json(property);
};

module.exports.updateProperty = async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
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
module.exports.validateProperty = async (req, res, next) => {
  req.sanitizeBody('owner');
  req.checkBody('owner', 'You must supply the owner!').notEmpty();
  const validationResult = await req.getValidationResult();
  const errors = validationResult.array();
  if (errors && errors.length > 0) {
    next(errors);
    return;
  }
  next();
};
