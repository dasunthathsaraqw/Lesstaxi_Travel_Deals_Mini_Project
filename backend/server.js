const express = require('express');
     const cors = require('cors');
     const dotenv = require('dotenv');
     const mongoose = require('mongoose');
     const dealsRouter = require('./routes/deals');

     dotenv.config();

     const app = express();
     const PORT = process.env.PORT || 5000;

     // Connect to MongoDB
     const connectDB = require('./config/db');
     connectDB();

     app.use(cors());
     app.use(express.json());

     // Health check endpoint
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

     // Use deals routes
     app.use('/api/deals', dealsRouter);

     app.listen(PORT, () => {
       console.log(`Server running on http://localhost:${PORT}`);
     });