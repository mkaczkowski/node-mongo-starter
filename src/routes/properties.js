const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { validateProperty, validateQuery } = require('../controllers/propertyController');
const { validateResult } = require('../utils/validators');

router.patch('/:id', validateProperty, validateResult, propertyController.updateProperty);

router.get('/', validateQuery, validateResult, propertyController.getProperties);

module.exports = router;
