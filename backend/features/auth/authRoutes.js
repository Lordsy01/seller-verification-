const express = require('express');
const router = express.Router();
const User = require('./User');
const generateToken = require('./generateToken');
const sendEmail = require('../../shared/utils/sendEmail');
const { protect } = require('../../shared/middleware/auth');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpToUser(user) {
  const otp = generateOtp();
  user.otpCode = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'Verify your DoualaMarket account',
    html: `
      <p>Hi ${user.name},</p>
      <p>Your verification code is:</p>
      <h2 style="letter-spacing: 4px;">${otp}</h2>
      <p>This code expires in 10 minutes.</p>
    `
  });
}

// SIGNUP — creates an unverified account, sends a verification code
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!['buyer', 'seller'].includes(role)) {
      return res.status(400).json({ message: 'Role must be buyer or seller' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role });
    await sendOtpToUser(user);

    // no token yet — they must verify their email first
    res.status(201).json({
      message: 'Account created. Check your email for a verification code.',
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// VERIFY EMAIL — completes signup, then logs the user in
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otpCode) {
      return res.status(400).json({ message: 'Please request a new code' });
    }
    if (user.otpCode !== otp) {
      return res.status(400).json({ message: 'Incorrect code' });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Code has expired, please request a new one' });
    }

    user.isEmailVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// RESEND CODE — in case the first email didn't arrive or expired
router.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'This account is already verified' });
    }

    await sendOtpToUser(user);
    res.json({ message: 'A new code has been sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// LOGIN — single step, but blocked if the email was never verified
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in',
        requiresVerification: true,
        email: user.email
      });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CHANGE PASSWORD — unchanged from before
router.patch('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// FORGOT PASSWORD — step 1: send a reset code
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // don't reveal whether the email exists — always respond the same way
    if (!user) {
      return res.json({ message: 'If that email exists, a reset code has been sent.' });
    }

    await sendOtpToUser(user); // reuses the same helper from signup

    res.json({ message: 'If that email exists, a reset code has been sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// FORGOT PASSWORD — step 2: verify the code and set a new password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otpCode) {
      return res.status(400).json({ message: 'Please request a new code' });
    }
    if (user.otpCode !== otp) {
      return res.status(400).json({ message: 'Incorrect code' });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Code has expired, please request a new one' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    user.password = newPassword; // pre-save hook hashes it automatically
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;