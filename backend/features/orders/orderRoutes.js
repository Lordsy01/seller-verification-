const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../orders/Order');
const Gig = require('../products/Gig');
const { protect, requireRole } = require('../../shared/middleware/auth');
const { initiatePayment, checkStatus } = require('../orders/iwomipay');


const DELIVERY_FEE = 2500;

function mapGatewayStatus(code) {
  const s = String(code);
  if (s === '01' || s === '1') return 'paid';
  if (s === '1000') return 'pending';
  return 'failed'; // covers 100, 401, 400, 404, 500, 503, or anything unexpected
}

// SELLER: orders that include at least one of their products
router.get('/selling', protect, requireRole('seller'), async (req, res) => {
  try {
    const myGigs = await Gig.find({ seller: req.user.id }).select('_id');
    const gigIds = myGigs.map((g) => g._id);

    const orders = await Order.find({ 'items.gig': { $in: gigIds } })
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// ADMIN: every order on the platform
router.get('/admin/all', protect, requireRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// CREATE ORDER + INITIATE PAYMENT
router.post('/', protect, async (req, res) => {
  try {
    const { items, phone, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    if (!['momo', 'om'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }
    if (!phone || !/^237\d{9}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be in the format 237XXXXXXXXX' });
    }

    // recompute prices from the database — never trust prices sent from the frontend
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const gig = await Gig.findById(item.productId);
      if (!gig || !gig.active) {
        return res.status(400).json({ message: `A product in your cart is no longer available` });
      }
      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      orderItems.push({ gig: gig._id, title: gig.title, price: gig.price, quantity });
      subtotal += gig.price * quantity;
    }

    const total = subtotal + DELIVERY_FEE;
    const externalId = `ORD-${crypto.randomBytes(6).toString('hex')}`;

    const order = await Order.create({
      buyer: req.user.id,
      items: orderItems,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      paymentMethod,
      phone,
      externalId,
      status: 'pending'
    });

    const callbackUrl = `${process.env.BACKEND_URL}/api/orders/callback`;

    const paymentRes = await initiatePayment({
      type: paymentMethod,
      amount: total,
      externalId,
      motif: `DoualaMarket order ${order._id}`,
      tel: phone,
      callbackUrl
    });

    order.internalId = paymentRes.internal_id || null;
    order.gatewayMessage = paymentRes.message || '';
    await order.save();

    res.status(201).json({
      message: 'Payment initiated. Approve the prompt sent to your phone.',
      orderId: order._id,
      status: order.status
    });
  } catch (err) {
    res.status(500).json({ message: 'Payment initiation failed', error: err.response?.data || err.message });
  }
});

// POLL ORDER STATUS (frontend calls this every few seconds while pending)
router.get('/:id/status', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyer: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'pending' && order.internalId) {
      const statusRes = await checkStatus(order.internalId);
      order.status = mapGatewayStatus(statusRes.status);
      order.gatewayMessage = statusRes.message || order.gatewayMessage;
      await order.save();
    }

    res.json({ orderId: order._id, status: order.status, message: order.gatewayMessage });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.response?.data || err.message });
  }
});

// CALLBACK — IwomiPay posts the final result directly to this URL
router.post('/callback', async (req, res) => {
  try {
    const { external_id, status, message } = req.body;
    const order = await Order.findOne({ externalId: external_id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = mapGatewayStatus(status);
    order.gatewayMessage = message || order.gatewayMessage;
    await order.save();

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// BUYER: order history
router.get('/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;