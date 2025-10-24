const mongoose = require('mongoose');

const connectDB = async () => {
  // Prefer PRODUCTION URI if available, then MONGO_URI, then fall back to local.
  const uri = process.env.MONGO_URI_PRODUCTION || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/financeTrack';

  try {
    await mongoose.connect(uri,);

    console.log(
      `✅ MongoDB connected successfully to ${
        uri.includes('mongodb+srv') ? 'PRODUCTION Cluster' : 'Local Instance'
      }`
    );

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
