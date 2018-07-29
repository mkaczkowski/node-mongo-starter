const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');

router.post('/',
  catchErrors(userController.validateUser),
  catchErrors(userController.registerUser));

router.patch('/',
  catchErrors(userController.updateAccount));

module.exports = router;
