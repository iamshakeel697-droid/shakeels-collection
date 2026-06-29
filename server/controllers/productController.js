const mongoose = require('mongoose');
const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean({ virtuals: true });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean({ virtuals: true });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }
    const product = await Product.findById(id).lean({ virtuals: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { title, description, imageUrl, originalPrice, salePrice, category, stock } = req.body;

    const product = await Product.create({
      title,
      description,
      imageUrl,
      originalPrice,
      salePrice: salePrice === '' || salePrice === undefined ? null : salePrice,
      category,
      stock,
    });

    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const { title, description, imageUrl, originalPrice, salePrice, category, stock, isActive } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (salePrice !== undefined) product.salePrice = salePrice === '' ? null : salePrice;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    res.status(200).json({ success: true, message: 'Product updated', product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
