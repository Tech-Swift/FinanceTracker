const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI_PRODUCTION || process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(uri,);

    console.log(`✅ MongoDB connected successfully to DB: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
