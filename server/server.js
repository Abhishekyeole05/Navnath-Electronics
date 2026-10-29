const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables before anything else
dotenv.config();

const { connectDB, getIsConnected, getUseMemoryStore } = require('./config/db');
const { seedDatabase } = require('./utils/seedData');
const apiRoutes = require('./routes/api');

const app = express();

const path = require('path');

// ==========================================
// CORS Configuration
// Allows frontend URL(s), Render preview domains, and localhost
// ==========================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach(url => {
    const clean = url.trim().replace(/\/+$/, '');
    if (clean) allowedOrigins.push(clean);
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');

    const isExplicitlyAllowed = allowedOrigins.some(
      allowed => cleanOrigin === allowed || cleanOrigin.startsWith(allowed)
    );

    // Also permit any *.onrender.com or *.vercel.app domain for seamless deployment previews
    const isRenderOrVercel =
      cleanOrigin.endsWith('.onrender.com') ||
      cleanOrigin.endsWith('.vercel.app');

    if (isExplicitlyAllowed || isRenderOrVercel || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`⚠️ [CORS] Blocked request from origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

app.use(express.json());

// Serve static client assets (e.g. product and category images)
app.use(express.static(path.join(__dirname, '../client/public')));

// API Routes
app.use('/api', apiRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  const isAtlas = getIsConnected();
  res.json({
    success: true,
    message: '⚡ New Navnath Electronics & Electricals API is Running!',
    database: isAtlas ? 'MongoDB Atlas (Live Cloud Database)' : 'Local In-Memory Mode (Set MONGODB_URI in server/.env to connect Atlas)',
    isConnectedToAtlas: isAtlas,
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`⚡ [New Navnath Server] API Running on Port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: ${getIsConnected() ? 'MongoDB Atlas (Cloud Cluster)' : 'Local In-Memory Demo Store'}`);
    console.log(`🔒 CORS Allowed Origins: ${allowedOrigins.join(', ')}`);
    console.log(`=======================================================`);
  });
};

startServer();
