const express = require('express');
     const router = express.Router();
     const dealsController = require('../controllers/dealsController');

     // Get all deals
     router.get('/', dealsController.getDeals);

     module.exports = router;