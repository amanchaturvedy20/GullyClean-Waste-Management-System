const mongoose = require("mongoose");

const binSchema = new mongoose.Schema(
  {
    binId: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    status: {
      type: String,
      enum: ["empty", "half-full", "full", "requested"],
      default: "empty",
    },
    lastEmptied: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Bin || mongoose.model("Bin", binSchema);
