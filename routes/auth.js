const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const passwordController = require('../controllers/auth/passwordController');
const catchErrors = require('../handlers/errorHandlers').catchErrors;

//OK
router.post('/login', authController.login);
//OK
router.get('/logout', authController.logout);
//OK
router.post('/forgot', catchErrors(passwordController.forgot));

router.post('/reset/:token',
  passwordController.confirmedPasswords,
  catchErrors(passwordController.update));

module.exports = router;
