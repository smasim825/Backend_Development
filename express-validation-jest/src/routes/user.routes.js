const express = require('express');
const { updateUserValidation } = require('../validators/user.validator');
const validate = require('../middlewares/validate.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile', userController.getProfile);
router.put('/profile', updateUserValidation, validate, userController.updateProfile);

module.exports = router;
