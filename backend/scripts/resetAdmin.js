require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function resetAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.log('No admin account found. Run createAdmin.js first.');
    process.exit(1);
  }

  admin.email = 'gigglelearn308@gmail.com';   // ← change to the email you want
  admin.password = '02468'; // ← change to the password you want
  admin.isEmailVerified = true;            // ← admins skip the OTP signup flow
  await admin.save(); // the pre-save hook automatically re-hashes the password

  console.log('Admin credentials updated:', admin.email);
  process.exit(0);
}

resetAdmin();