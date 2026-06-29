const express = require('express');
const rateLimit = require('express-rate-limit');
const { createOrder, getOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { orderValidator } = require('../middleware/validators');

const router = express.Router();

const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many orders placed, please try again later' },
});

router.post('/', orderLimiter, orderValidator, createOrder);
router.get('/', protect, getOrders);
router.patch('/:id/status', protect, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
