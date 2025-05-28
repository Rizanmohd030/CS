// server/models/Attendance.js
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: Date,
  status: {
    type: String,
    enum: ['present', 'completed', 'absent'],
    default: 'present'
  },
  device: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
AttendanceSchema.index({ worker: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);