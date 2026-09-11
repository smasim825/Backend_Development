const express = require('express');
const { registerValidation, loginValidation } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);

module.exports = router;
