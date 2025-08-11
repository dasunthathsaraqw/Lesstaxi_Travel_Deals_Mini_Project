const Deal = require('../models/Deal');
const cloudinary = require('../config/cloudinary');

module.exports = {
  getDeals: async (req, res) => {
    try {
      const deals = await Deal.find();
      res.json(deals);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

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
  }
};