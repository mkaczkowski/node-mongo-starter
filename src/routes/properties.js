const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { validateProperty } = require('../controllers/propertyController');
const { validateResult } = require('../utils/validators');

router.patch(
  '/:id',
  validateProperty,
  validateResult,
  propertyController.updateProperty
);

router.get('/', propertyController.getProperties);

module.exports = router;
