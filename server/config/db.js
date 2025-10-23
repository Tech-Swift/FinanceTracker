const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to local first
    let uri = process.env.MONGO_URI;

    // If NODE_ENV is 'production', use Atlas
    if (process.env.NODE_ENV === 'production') {
      uri = process.env.MONGO_URI_ATLAS;
    }

    // Connect
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `✅ MongoDB connected successfully to ${
        uri.includes('mongodb+srv') ? 'Atlas Cluster' : 'Local Instance'
      }`
    );
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
