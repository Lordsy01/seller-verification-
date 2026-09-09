const express = require('express');
const router = express.Router();
const Gig = require('../products/Gig');
const User = require('../auth/User');
const upload = require('../../shared/middleware/upload');
const { protect, requireRole } = require('../../shared/middleware/auth');

// PUBLIC: get all active gigs (for the homepage)
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find({ active: true })
      .populate('seller', 'name')
      .sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// SELLER: get only their own gigs (for a "My Gigs" dashboard later)
router.get('/mine', protect, requireRole('seller'), async (req, res) => {
  try {
    const gigs = await Gig.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// SELLER: create a gig — must be an APPROVED seller
router.post('/', protect, requireRole('seller'), upload.single('image'), async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (currentUser.verificationStatus !== 'approved') {
      return res.status(403).json({ message: 'Only verified sellers can post gigs' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Gig image is required' });
    }

    const { title, description, price } = req.body;

    const gig = await Gig.create({
      seller: req.user.id,
      title,
      description,
      price,
      image: req.file.path.replace(/\\/g, '/') // normalize Windows backslashes to forward slashes
    });

    res.status(201).json({ message: 'Gig posted successfully', data: gig });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// SELLER: deactivate their own gig
router.patch('/:id/deactivate', protect, requireRole('seller'), async (req, res) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id, seller: req.user.id });
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    gig.active = false;
    await gig.save();
    res.json({ message: 'Gig deactivated', data: gig });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: get every product regardless of active status
router.get('/admin/all', protect, requireRole('admin'), async (req, res) => {
  try {
    const gigs = await Gig.find({}).populate('seller', 'name email').sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: activate/deactivate any product
router.patch('/:id/admin-toggle', protect, requireRole('admin'), async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Product not found' });
    gig.active = !gig.active;
    await gig.save();
    res.json({ message: `Product ${gig.active ? 'activated' : 'deactivated'}`, data: gig });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// PUBLIC: get one product by ID
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('seller', 'name verificationStatus');
    if (!gig || !gig.active) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;