const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: {
      type: String,
      required: [true, 'Location address is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  binStatus: {
    type: String,
    enum: ['almost-full', 'full', 'overflowing'],
    required: [true, 'Bin status is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 500
  },
  photo: {
    type: String,
    required: [true, 'Photo is required']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  },
  authorityNotes: {
    type: String,
    maxlength: 500
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
reportSchema.index({ user: 1, reportedAt: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ reportedAt: -1 });

module.exports = mongoose.model('Report', reportSchema);