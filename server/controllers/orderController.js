const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, address, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    const qty = quantity ? parseInt(quantity, 10) : 1;
    const unitPrice =
      product.salePrice !== null && product.salePrice !== undefined && product.salePrice < product.originalPrice
        ? product.salePrice
        : product.originalPrice;

    const totalPrice = unitPrice * qty;

    const order = await Order.create({
      customerName,
      phone,
      address,
      product: product._id,
      productTitle: product.title,
      unitPrice,
      quantity: qty,
      totalPrice,
      paymentMethod: 'COD',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('product', 'title imageUrl');

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }

    const allowedStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, deleteOrder };
