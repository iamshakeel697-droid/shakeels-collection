const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isString()
    .isLength({ min: 8, max: 100 })
    .withMessage('Password must be at least 8 characters'),
  handleValidation,
];

const productValidator = [
  body('title')
    .isString()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be between 2 and 150 characters'),
  body('description')
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ max: 2000 })
    .withMessage('Description too long'),
  body('imageUrl')
    .isString()
    .trim()
    .isLength({ min: 3, max: 2000 })
    .withMessage('Image URL is required'),
  body('originalPrice')
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  body('salePrice')
    .optional({ checkFalsy: true, nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Sale price must be a positive number')
    .custom((value, { req }) => {
      if (value !== undefined && value !== null && value !== '') {
        if (parseFloat(value) >= parseFloat(req.body.originalPrice)) {
          throw new Error('Sale price must be less than original price');
        }
      }
      return true;
    }),
  body('category').optional({ checkFalsy: true }).isString().isLength({ max: 100 }),
  body('stock').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidation,
];

const orderValidator = [
  body('customerName')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Customer name contains invalid characters'),
  body('phone')
    .isString()
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage('Enter a valid phone number'),
  body('address')
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  body('productId').isMongoId().withMessage('Invalid product reference'),
  body('quantity')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be between 1 and 50'),
  handleValidation,
];

module.exports = { loginValidator, productValidator, orderValidator, handleValidation };
