const express = require('express');
const router = express.Router();
const { getAssignedPickups, completePickupPhoto, getWorkerDashboardStats, updateWorkerLocation } = require('../controllers/workerController');
const { protect, worker } = require('../middleware/authMiddleware');

router.route('/tasks').get(protect, worker, getAssignedPickups);
router.route('/pickups/:id/complete').put(protect, worker, completePickupPhoto);
router.route('/stats').get(protect, worker, getWorkerDashboardStats);
router.route('/location').put(protect, worker, updateWorkerLocation);

module.exports = router;
