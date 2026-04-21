const express = require('express');
const router = express.Router();
const {
  getBins,
  createBin,
  updateBinStatus,
  deleteBin,
  getBinById,
} = require('../controllers/binController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getBins).post(protect, admin, createBin);
router.route('/:id').get(getBinById).delete(protect, admin, deleteBin);
router.route('/:id/status').put(protect, admin, updateBinStatus);


module.exports = router;