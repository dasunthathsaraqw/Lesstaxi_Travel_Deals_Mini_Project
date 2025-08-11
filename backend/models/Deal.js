const mongoose = require('mongoose');

     const dealSchema = new mongoose.Schema({
       title: { type: String, required: true },
       description: { type: String, required: true },
       price: { type: Number, required: true },
       discountedPrice: { type: Number, required: true },
       location: { type: String, required: true },
       purchased: { type: Number, default: 0 },
       timer: { type: String }
     });

     const Deal = mongoose.model('Deal', dealSchema);

     module.exports = Deal;