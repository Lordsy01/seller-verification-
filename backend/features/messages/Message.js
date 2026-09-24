const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }, // optional — general inquiries allowed too
    body: { type: String, required: true, trim: true, maxlength: 1000 },
    reply: { type: String, default: '' },
    status: { type: String, enum: ['open', 'replied'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);