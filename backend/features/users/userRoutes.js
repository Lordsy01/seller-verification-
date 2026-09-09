const express = require('express');
const router = express.Router();
const User = require('../../features/auth/User');
const Verification = require('../../features/verification/Verification');
const Gig = require('../../features/products/Gig');
const { protect, requireRole } = require('../../shared/middleware/auth');

// ADMIN: list all users (optionally filter by role)
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: delete a user account entirely
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // don't allow an admin to accidentally delete their own account this way
    if (targetUser._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You can't delete your own account" });
    }

    // clean up anything that references this user, so we don't leave orphaned data
    await Verification.deleteMany({ seller: targetUser._id });
    await Gig.deleteMany({ seller: targetUser._id });
    await User.findByIdAndDelete(targetUser._id);

    res.json({ message: `${targetUser.name} was deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;