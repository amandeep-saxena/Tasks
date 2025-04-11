const { body } = require('express-validator');

exports.taskValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('status').optional().isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be one of: pending, in-progress, completed'),
];