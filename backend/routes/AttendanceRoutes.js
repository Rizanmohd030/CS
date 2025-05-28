// server/routes/attendance.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const Worker = require('../models/Worker');

// @route   POST api/attendance/scan
// @desc    Process RFID scan
router.post('/scan', [
  check('rfid', 'RFID is required').not().isEmpty(),
  check('device', 'Device ID is required').not().isEmpty(),
  check('siteId', 'Site ID is required').not().isEmpty()
], async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rfid, device, siteId } = req.body;
  
  try {
    // 1. Find worker by RFID (case insensitive)
    const worker = await Worker.findOne({ 
      rfid: rfid.toUpperCase(),
      site: siteId,
      active: true
    });
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found or inactive' });
    }

    // 2. Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Check existing attendance
    let attendance = await Attendance.findOne({
      worker: worker._id,
      date: today,
      site: siteId
    });

    // 4. Process attendance logic
    if (!attendance) {
      // First scan of the day - check in
      attendance = new Attendance({
        worker: worker._id,
        site: siteId,
        date: today,
        checkIn: new Date(),
        status: 'present',
        device
      });
    } else if (!attendance.checkOut) {
      // Second scan - check out
      attendance.checkOut = new Date();
      attendance.status = 'completed';
    } else {
      // Already checked in and out
      return res.status(400).json({ 
        error: 'Worker already checked in and out today' 
      });
    }

    await attendance.save();

    // 5. Get current attendance stats
    const presentCount = await Attendance.countDocuments({
      date: today,
      site: siteId,
      status: 'present'
    });

    const totalWorkers = await Worker.countDocuments({ 
      site: siteId,
      active: true 
    });

    res.json({
      worker: {
        id: worker._id,
        name: worker.name,
        position: worker.position,
        rfid: worker.rfid
      },
      attendance: {
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        status: attendance.status
      },
      stats: {
        presentCount,
        totalWorkers,
        absentCount: totalWorkers - presentCount
      }
    });

  } catch (err) {
    console.error('RFID scan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;