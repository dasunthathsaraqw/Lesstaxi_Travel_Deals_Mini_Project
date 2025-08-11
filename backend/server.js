require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dealsRouter = require('./routes/deals');


// Log env variables to debug
console.log('Environment Variables:', {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Not Set',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
});

const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = require('./config/db');
connectDB();

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
      status: 'ok',
      mongodb: dbStatus,
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use('/api/deals', dealsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});