const Pickup = require("../models/pickup");
const Bin = require("../models/bin");
const User = require("../models/user");
const mongoose = require("mongoose");

// @desc    Create a new pickup request
const createPickup = async (req, res) => {
  const { binId, location, coordinates, notes, citizenPhoto } = req.body;
  if (!binId) {
    return res.status(400).json({ message: "binId is required" });
  }
  let bin = await Bin.findOne({ binId: String(binId) });
  if (!bin) {
    bin = await Bin.create({
      binId: binId,
      location: location,
      coordinates: coordinates || null,
      status: "full",
    });
  } else if (coordinates) {
    bin.coordinates = coordinates; // Update existing bin with new coords
  }

  // Only look at ONLINE workers who have a valid location
  const allWorkers = await User.find({ role: "worker" });
  let workers = allWorkers.filter(
    (w) =>
      w.isTracking &&
      w.location &&
      (w.location.lat !== 0 || w.location.lng !== 0),
  );

  let assignedTo = null;
  let status = "pending";
  const MAX_ASSIGNMENT_DISTANCE_KM = 5; // 5km threshold

  if (workers.length > 0 && coordinates && coordinates.lat && coordinates.lng) {
    let nearestWorker = null;
    let minDistance = Infinity;

    // Haversine formula to calculate distance between two lat/lng coordinates
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d;
    };

    workers.forEach((worker) => {
      if (worker.location && worker.location.lat && worker.location.lng) {
        const distance = getDistanceFromLatLonInKm(
          coordinates.lat,
          coordinates.lng,
          worker.location.lat,
          worker.location.lng,
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestWorker = worker;
        }
      }
    });

    // Only assign if the nearest worker is within the threshold distance
    if (nearestWorker && minDistance <= MAX_ASSIGNMENT_DISTANCE_KM) {
      assignedTo = nearestWorker._id;
      status = "assigned";
    }
    // Otherwise, remains 'pending'
  }

  const pickup = new Pickup({
    bin: bin._id,
    user: req.user._id,
    notes,
    location: location,
    coordinates: coordinates || null,
    citizenPhoto: citizenPhoto || null,
    status: status,
    assignedTo: assignedTo,
  });

  // Change bin status to requested
  bin.status = "requested";
  await bin.save();

  const createdPickup = await pickup.save();
  res.status(201).json(createdPickup);
};

// @desc    Get all pickup requests
const getAllPickups = async (req, res) => {
  const pickups = await Pickup.find({})
    .populate("user", "name")
    .populate("bin", "location")
    .populate("assignedTo", "name");
  res.json(pickups);
};

// @desc    Get logged in user pickup requests
const getUserPickups = async (req, res) => {
  const pickups = await Pickup.find({ user: req.user._id }).populate(
    "bin",
    "location",
  );
  res.json(pickups);
};

// @desc    Get a single pickup by ID
const getPickupById = async (req, res) => {
  const pickup = await Pickup.findById(req.params.id)
    .populate("user", "name email")
    .populate("bin", "location status");
  if (pickup) {
    res.json(pickup);
  } else {
    res.status(404).json({ message: "Pickup not found" });
  }
};

// @desc    Assign a worker to a pickup
const assignPickup = async (req, res) => {
  const { workerId, scheduleDate } = req.body;
  const pickup = await Pickup.findById(req.params.id);
  if (pickup) {
    pickup.assignedTo = workerId;
    pickup.status = "assigned";
    pickup.scheduledFor = scheduleDate;
    const updatedPickup = await pickup.save();
    res.json(updatedPickup);
  } else {
    res.status(404).json({ message: "Pickup not found" });
  }
};

// @desc    Mark a pickup as complete
const completePickup = async (req, res) => {
  const pickup = await Pickup.findById(req.params.id);
  if (pickup) {
    pickup.status = "completed";
    pickup.completedDate = Date.now();
    const updatedPickup = await pickup.save();
    res.json(updatedPickup);
  } else {
    res.status(404).json({ message: "Pickup not found" });
  }
};

module.exports = {
  createPickup,
  getAllPickups,
  assignPickup,
  completePickup,
  getPickupById,
  getUserPickups,
};
