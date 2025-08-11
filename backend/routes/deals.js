const express = require('express');
const router = express.Router();
const dealsController = require('../controllers/dealsController');
const upload = require('../config/multer');

router.get('/', dealsController.getDeals);
router.get('/:id', dealsController.getDealById);
router.post('/', upload.single('image'), dealsController.createDeal);
router.put('/:id', upload.single('image'), dealsController.updateDeal);
router.delete('/:id', dealsController.deleteDeal);

module.exports = router;