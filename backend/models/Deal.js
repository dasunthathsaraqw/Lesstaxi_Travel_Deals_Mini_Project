const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  location: { type: String, required: true },
  purchasedCount: { type: Number, default: 0 },
  timer: { type: String },
  category: { type: String },
  reviewsCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;