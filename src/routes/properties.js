const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const propertyController = require('../controllers/propertyController');

router.get('/:id', catchErrors(propertyController.getPropertyById));

router.patch('/:id', catchErrors(propertyController.updateProperty));

router.get('/', catchErrors(propertyController.getProperties));

module.exports = router;
