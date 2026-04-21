const express = require('express');
const router = express.Router();
const { getAdminDashboardStats, getAllWorkers, getAllCitizens, getWorkerStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware'); // we will need to verify if these middlewares exist

// We'll attach the protect and admin middlewares later once we confirm their names/existence.
// For now, setting up the basic routing structure.
router.get('/stats', getAdminDashboardStats);
router.get('/workers', getAllWorkers);
router.get('/citizens', getAllCitizens);
router.get('/worker-stats', getWorkerStats);

module.exports = router;
