const mongoose = require('mongoose');
const memoryStore = require('./memoryStore');

let isConnected = false;
let useMemoryStore = true;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (
    !mongoURI || 
    mongoURI.includes('YOUR_MONGODB_ATLAS_CONNECTION_STRING') || 
    mongoURI.includes('<username>') ||
    mongoURI.includes('<password>') ||
    mongoURI === 'mongodb://localhost:27017/navnath_electricals_demo'
  ) {
    console.log('=======================================================');
    console.log('⚡ [Database Mode] Local In-Memory Demo Store Active');
    console.log('💡 [MongoDB Atlas Setup] To connect your live MongoDB Atlas cluster:');
    console.log('   1. Open server/.env');
    console.log('   2. Set MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/navnath_electronics?retryWrites=true&w=majority');
    console.log('   3. Restart the server');
    console.log('=======================================================');
    isConnected = false;
    useMemoryStore = true;
    return;
  }

  try {
    console.log('🔌 [MongoDB Init] Connecting to MongoDB Atlas Cloud Cluster...');
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    useMemoryStore = false;
    console.log('=======================================================');
    console.log(`✅ [MongoDB Atlas] Successfully Connected to MongoDB Atlas!`);
    console.log(`🌐 Cluster Host: ${conn.connection.host}`);
    console.log(`🗄️  Database Name: ${conn.connection.name || 'navnath_electronics'}`);
    console.log('=======================================================');
  } catch (error) {
    console.warn(`⚠️ [MongoDB Atlas] Connection failed: ${error.message}`);
    console.warn('⚡ [Fallback Store] Enabling Local In-Memory Store for zero-downtime execution.');
    isConnected = false;
    useMemoryStore = true;
  }
};

const getIsConnected = () => isConnected;
const getUseMemoryStore = () => useMemoryStore;

module.exports = {
  connectDB,
  getIsConnected,
  getUseMemoryStore,
  memoryStore
};
