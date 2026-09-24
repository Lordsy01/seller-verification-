const express = require('express');
const router = express.Router();
const Message = require('./Message');
const { protect, requireRole } = require('../../shared/middleware/auth');

// BUYER: send a message (optionally tied to a product)
router.post('/', protect, async (req, res) => {
    try {
        const { productId, body } = req.body;
        if (!body || !body.trim()) {
            return res.status(400).json({ message: 'Message cannot be empty' });
        }

        const message = await Message.create({
            buyer: req.user.id,
            product: productId || undefined,
            body: body.trim()
        });

        res.status(201).json({ message: 'Message sent', data: message });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// BUYER: view their own message thread
router.get('/mine', protect, async (req, res) => {
    try {
        const messages = await Message.find({ buyer: req.user.id })
            .populate('product', 'title')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ADMIN: view every message
router.get('/', protect, requireRole('admin'), async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const messages = await Message.find(filter)
            .populate('buyer', 'name email location')
            .populate('product', 'title')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ADMIN: reply to a message
router.patch('/:id/reply', protect, requireRole('admin'), async (req, res) => {
    try {
        const { reply } = req.body;
        if (!reply || !reply.trim()) {
            return res.status(400).json({ message: 'Reply cannot be empty' });
        }
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { reply: reply.trim(), status: 'replied' },
            { new: true }
        );
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json({ message: 'Reply sent', data: message });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;