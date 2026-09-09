const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 5
  },
  image: {
    type: String, // path to uploaded gig image
    required: true
  },
  active: {
    type: Boolean,
    default: true // lets a seller "unpublish" a gig later without deleting it
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gig', gigSchema);