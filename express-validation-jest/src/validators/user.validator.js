const { body } = require('express-validator');

const updateUserValidation = [
    body('age')
        .optional()
        .isInt({ min: 18, max: 100 }).withMessage('Age must be an integer between 18 and 100'),
    body('role')
        .optional()
        .isIn(['user', 'artist', 'admin']).withMessage('Role must be user, artist, or admin')
];

module.exports = { updateUserValidation };
