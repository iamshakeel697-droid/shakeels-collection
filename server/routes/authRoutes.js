const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginValidator } = require('../middleware/validators');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later' },
});

router.post('/login', loginLimiter, loginValidator, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
