const Bin = require("../models/bin");

// @desc    Get all bins
const getBins = async (req, res) => {
  const bins = await Bin.find({});
  res.json(bins);
};

// @desc    Get a single bin by ID
const getBinById = async (req, res) => {
  const bin = await Bin.findById(req.params.id);
  if (bin) {
    res.json(bin);
  } else {
    res.status(404).json({ message: "Bin not found" });
  }
};

// @desc    Create a new bin
const createBin = async (req, res) => {
  const { location } = req.body;
  const bin = new Bin({ location });
  const createdBin = await bin.save();
  res.status(201).json(createdBin);
};

// @desc    Update bin status
const updateBinStatus = async (req, res) => {
  const { status } = req.body;
  const bin = await Bin.findById(req.params.id);
  if (bin) {
    bin.status = status;
    if (status === "empty") bin.lastEmptied = Date.now();
    const updatedBin = await bin.save();
    res.json(updatedBin);
  } else {
    res.status(404).json({ message: "Bin not found" });
  }
};

// @desc    Delete a bin
const deleteBin = async (req, res) => {
  const bin = await Bin.findById(req.params.id);
  if (bin) {
    await bin.deleteOne();
    res.json({ message: "Bin removed" });
  } else {
    res.status(404).json({ message: "Bin not found" });
  }
};

module.exports = { getBins, createBin, updateBinStatus, deleteBin, getBinById };
