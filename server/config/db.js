const mongoose = require('mongoose');
const memoryStore = require('./memoryStore');

let isConnected = false;
let useMemoryStore = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI || mongoURI === 'mongodb://localhost:27017/navnath_electricals_demo') {
    console.log('⚡ [New Navnath DB] Running in Local Demo/Memory Mode (Zero-Config DB Fallback Enabled).');
    useMemoryStore = true;
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    useMemoryStore = false;
    console.log(`✅ [New Navnath DB] Connected to MongoDB Atlas: ${conn.connection.host}`);
  } catch (error) {
    console.warn('⚠️ [New Navnath DB] MongoDB connection failed. Falling back to Local Memory Store:', error.message);
    useMemoryStore = true;
  }
};

const getUseMemoryStore = () => useMemoryStore;

module.exports = {
  connectDB,
  getUseMemoryStore,
  memoryStore
};
