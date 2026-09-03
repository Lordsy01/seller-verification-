require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

const authRoutes = require('./routes/authRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const gigRoutes = require('./routes/gigRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/orders', orderRoutes);

// ---- routes ----

app.use('/api/auth', authRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.send('Seller Verification API running');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));