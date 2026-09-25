require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./features/auth/authRoutes');
const verificationRoutes = require('./features/verification/verificationRoutes');
const gigRoutes = require('./features/products/gigRoutes');
const userRoutes = require('./features/users/userRoutes');
const orderRoutes = require('./features/orders/orderRoutes');
const messageRoutes = require('./features/messages/messageRoutes');

const app = express();

// ---- middleware (must all come before routes) ----
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ---- routes ----
app.use('/api/auth', authRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Seller Verification API running');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));