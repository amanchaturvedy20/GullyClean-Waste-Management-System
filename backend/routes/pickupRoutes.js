const express = require('express');
const router = express.Router();
const {
  createPickup,
  getAllPickups,
  assignPickup,
  completePickup,
  getPickupById,
  getUserPickups,
} = require('../controllers/pickupController');
const { protect, admin, worker } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getAllPickups).post(protect, createPickup);
router.get('/mypickups', protect, getUserPickups);
router.route('/:id').get(protect, getPickupById);
router.put('/:id/assign', protect, admin, assignPickup);
router.put('/:id/complete', protect, worker, completePickup);


module.exports = router;