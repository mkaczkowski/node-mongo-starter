const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { validateProperty, validateQuery } = require('../controllers/propertyController');
const { validateResult } = require('../utils/validators');

router.patch('/properties/:id', validateProperty, validateResult, propertyController.updateProperty);

router.get('/properties/:id', propertyController.getProperty);

router.get('/properties', validateQuery, validateResult, propertyController.getProperties);

module.exports = router;
