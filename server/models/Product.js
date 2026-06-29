const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
      default: null,
      validate: {
        validator: function (value) {
          if (value === null || value === undefined) return true;
          return value < this.originalPrice;
        },
        message: 'Sale price must be less than original price',
      },
    },
    category: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'General',
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.virtual('isOnSale').get(function () {
  return this.salePrice !== null && this.salePrice !== undefined && this.salePrice < this.originalPrice;
});

productSchema.virtual('discountPercent').get(function () {
  if (!this.isOnSale) return 0;
  return Math.round(((this.originalPrice - this.salePrice) / this.originalPrice) * 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ title: 'text', category: 1 });

module.exports = mongoose.model('Product', productSchema);
