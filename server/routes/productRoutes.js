const express = require('express');
const {
  getProducts,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { productValidator } = require('../middleware/validators');

const router = express.Router();

router.get('/', getProducts);
router.get('/admin/all', protect, getAllProductsAdmin);
router.get('/:id', getProductById);
router.post('/', protect, productValidator, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
