const express = require('express');
const router = express.Router();
const Verification = require('../models/Verification');
const User = require('../models/User');
const upload = require('../middleware/upload');
const { protect, requireRole } = require('../middleware/auth');

// SELLER: submit verification (must be logged in as a seller)
router.post('/submit', protect, requireRole('seller'), upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Document image is required' });
    }

    const existing = await Verification.findOne({ seller: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted a verification request', data: existing });
    }

    const newVerification = await Verification.create({
      seller: req.user.id,
      documentPath: req.file.path.replace(/\\/g, '/') // normalize Windows backslashes to forward slashes
    });

    res.status(201).json({
      message: 'Verification request submitted successfully',
      data: newVerification
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// SELLER: check their own verification status
router.get('/me', protect, requireRole('seller'), async (req, res) => {
  try {
    const verification = await Verification.findOne({ seller: req.user.id });
    if (!verification) {
      return res.status(404).json({ message: 'No verification request found' });
    }
    res.json(verification);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: get all verification requests, with seller details attached
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const verifications = await Verification.find(filter)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json(verifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: approve or reject
router.patch('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const updated = await Verification.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    await User.findByIdAndUpdate(updated.seller, { verificationStatus: status });

    res.json({ message: `Request ${status}`, data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;