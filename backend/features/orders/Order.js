const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
    title: String,
    price: Number,
    quantity: Number
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['momo', 'om'], required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  externalId: { type: String, required: true, unique: true }, // our ID, sent to IwomiPay
  internalId: { type: String }, // IwomiPay's own transaction ID, used to poll status
  gatewayMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);