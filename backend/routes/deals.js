const express = require('express');
const router = express.Router();
const dealsController = require('../controllers/dealsController');
const upload = require('../config/multer');

router.get('/', dealsController.getDeals);
router.post('/', upload.single('image'), dealsController.createDeal);

module.exports = router;