const Deal = require('../models/Deal');

     module.exports = {
       getDeals: async (req, res) => {
         try {
           const deals = await Deal.find(); // Fetch all deals from MongoDB
           res.json(deals);
         } catch (err) {
           res.status(500).json({ message: err.message });
         }
       }
     };