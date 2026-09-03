require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: 'admin@yoursite.com' });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const admin = await User.create({
    name: 'Site Admin',
    email: ' admin@yoursite.com',
    password: 'ChangeThisPassword123', // change this before running!
    role: 'admin'
  });

  console.log('Admin created:', admin.email);
  process.exit(0);
}

createAdmin();