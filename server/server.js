const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./utils/seedData');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '⚡ New Navnath Electronics & Electricals API is Running!',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      services: '/api/services',
      auth: '/api/auth/profile'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`⚡ [New Navnath Server] API Running on Port ${PORT}`);
    console.log(`=======================================================`);
  });
};

startServer();
