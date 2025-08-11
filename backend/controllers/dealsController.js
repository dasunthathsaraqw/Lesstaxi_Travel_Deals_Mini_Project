const Deal = require('../models/Deal');
const cloudinary = require('../config/cloudinary');

module.exports = {
  // READ all deals
  getDeals: async (req, res) => {
    try {
      const deals = await Deal.find();
      res.json(deals);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // READ single deal by ID
  getDealById: async (req, res) => {
    try {
      const deal = await Deal.findById(req.params.id);
      if (!deal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      res.json(deal);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // CREATE deal
  createDeal: async (req, res) => {
    try {
      const { title, description, tags, price, discountedPrice, location, purchasedCount, timer, category, reviewsCount, rating } = req.body;

      // Upload image to Cloudinary
      let imageUrl = '';
      if (req.file) {
        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
          folder: 'travel_deals'
        });
        imageUrl = result.secure_url;
      } else {
        return res.status(400).json({ message: 'Image is required' });
      }

      const newDeal = new Deal({
        image: imageUrl,
        title,
        description,
        tags: tags ? tags.split(',') : [],
        price: parseFloat(price),
        discountedPrice: parseFloat(discountedPrice),
        location,
        purchasedCount: parseInt(purchasedCount) || 0,
        timer,
        category,
        reviewsCount: parseInt(reviewsCount) || 0,
        rating: parseFloat(rating) || 0
      });

      const savedDeal = await newDeal.save();
      res.status(201).json(savedDeal);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // UPDATE deal by ID
  updateDeal: async (req, res) => {
    try {
      const { title, description, tags, price, discountedPrice, location, purchasedCount, timer, category, reviewsCount, rating } = req.body;

      const updateData = {
        title,
        description,
        tags: tags ? tags.split(',') : [],
        price: parseFloat(price),
        discountedPrice: parseFloat(discountedPrice),
        location,
        purchasedCount: parseInt(purchasedCount) || 0,
        timer,
        category,
        reviewsCount: parseInt(reviewsCount) || 0,
        rating: parseFloat(rating) || 0
      };

      // Update image if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
          folder: 'travel_deals'
        });
        updateData.image = result.secure_url;
      }

      const deal = await Deal.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!deal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      res.json(deal);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // DELETE deal by ID
  deleteDeal: async (req, res) => {
    try {
      const deal = await Deal.findByIdAndDelete(req.params.id);
      if (!deal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      res.json({ message: 'Deal deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};