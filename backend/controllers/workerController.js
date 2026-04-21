const Pickup = require('../models/pickup');
const Bin = require('../models/bin');
const User = require('../models/user');

// @desc    Update worker's live location
// @route   PUT /api/worker/location
// @access  Private/Worker
const updateWorkerLocation = async (req, res) => {
  try {
    const { lat, lng, isTracking } = req.body;
    
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    user.location.lat = Number(lat);
    user.location.lng = Number(lng);
    user.location.lastUpdated = Date.now();
    if (isTracking !== undefined) {
      user.isTracking = isTracking;
    }
    
    await user.save();

    // If worker is active, check if there are any pending pickups nearby
    if (user.isTracking && user.location.lat && user.location.lng) {
      const pendingPickups = await Pickup.find({ status: 'pending', assignedTo: null });
      
      const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
          const R = 6371; 
          const dLat = (lat2 - lat1) * (Math.PI / 180);
          const dLon = (lon2 - lon1) * (Math.PI / 180);
          const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
          return R * c; 
      };

      let newlyAssigned = 0;
      for (let pickup of pendingPickups) {
        let shouldAssign = false;

        if (pickup.coordinates && pickup.coordinates.lat && pickup.coordinates.lng) {
          // Has coordinates: assign only if within 5km
          const distance = getDistanceFromLatLonInKm(
            pickup.coordinates.lat, pickup.coordinates.lng,
            user.location.lat, user.location.lng
          );
          if (distance <= 5) shouldAssign = true;
        } else {
          // No coordinates: assign to first available online worker
          shouldAssign = true;
        }

        if (shouldAssign) {
          pickup.assignedTo = user._id;
          pickup.status = 'assigned';
          await pickup.save();
          newlyAssigned++;
        }
      }

      return res.status(200).json({ 
        message: 'Location updated successfully', 
        location: user.location,
        newlyAssigned 
      });
    }

    res.status(200).json({ message: 'Location updated successfully', location: user.location });
  } catch (error) {
    console.error('Error updating worker location:', error);
    res.status(500).json({ message: 'Server Error updating location' });
  }
};

// @desc    Get assigned pickups for logged-in worker
// @route   GET /api/worker/tasks
// @access  Private/Worker
const getAssignedPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ assignedTo: req.user._id, status: { $ne: 'completed' } })
      .populate('bin', 'location status binId')
      .populate('user', 'name email');
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching assigned tasks' });
  }
};

// @desc    Complete a pickup with a photo
// @route   PUT /api/worker/pickups/:id/complete
// @access  Private/Worker
const completePickupPhoto = async (req, res) => {
  try {
    const { workerPhoto, coordinates } = req.body;
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }

    if (pickup.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to complete this pickup' });
    }

    // Distance validation
    if (pickup.coordinates && pickup.coordinates.lat && pickup.coordinates.lng) {
        if (!coordinates || !coordinates.lat || !coordinates.lng) {
            return res.status(400).json({ message: 'Location access is required to verify distance to the bin.' });
        }

        const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
            const R = 6371; 
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a = 
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
              Math.sin(dLon / 2) * Math.sin(dLon / 2); 
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
            return R * c; 
        };

        const distance = getDistanceFromLatLonInKm(
            pickup.coordinates.lat, pickup.coordinates.lng,
            coordinates.lat, coordinates.lng
        );

        // 0.5 km = 500 meters
        if (distance > 0.5) {
            return res.status(400).json({ message: `You are too far (${(distance*1000).toFixed(0)}m) from the bin location to complete this task.` });
        }
    }

    pickup.status = 'completed';
    pickup.completedDate = Date.now();
    pickup.workerPhoto = workerPhoto || null;

    const updatedPickup = await pickup.save();

    // Also update the associated bin's status to empty
    const bin = await Bin.findById(pickup.bin);
    if (bin) {
      bin.status = 'empty';
      bin.lastEmptied = Date.now();
      await bin.save();
    }

    res.json(updatedPickup);
  } catch (error) {
    res.status(500).json({ message: 'Server Error completing pickup' });
  }
};

// @desc    Get dashboard stats for logged-in worker
// @route   GET /api/worker/stats
// @access  Private/Worker
const getWorkerDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalCompleted = await Pickup.countDocuments({ assignedTo: req.user._id, status: 'completed' });
    const pendingTasks = await Pickup.countDocuments({ assignedTo: req.user._id, status: { $ne: 'completed' } });
    const dailyCompleted = await Pickup.countDocuments({ 
        assignedTo: req.user._id, 
        status: 'completed', 
        completedDate: { $gte: today } 
    });

    res.json({ totalCompleted, pendingTasks, dailyCompleted });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};
module.exports = { 
  getAssignedPickups, 
  completePickupPhoto, 
  getWorkerDashboardStats,
  updateWorkerLocation
};
