const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['not_applicable', 'pending', 'approved', 'rejected'],
    default: function () {
      // buyers never need verification; sellers start pending
      return this.role === 'seller' ? 'pending' : 'not_applicable';
    }
  },
  otpCode: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    enum: require('../../shared/constants/doualaNeighborhoods')
  },
}, {
  timestamps: true
});

// hash the password automatically before saving, if it changed
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// instance method to check a plain password against the hashed one
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);