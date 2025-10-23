const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Step 1: Try Local MongoDB
    console.log('🟡 Trying to connect to local MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to Local MongoDB successfully');
  } catch (localError) {
    console.warn('⚠️ Local MongoDB connection failed:', localError.message);
    console.log('🔁 Attempting to connect to MongoDB Atlas...');

    try {
      // Step 2: Fallback to Atlas
      await mongoose.connect(process.env.MONGO_URI_ATLAS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to MongoDB Atlas successfully');
    } catch (atlasError) {
      console.error('❌ Both local and Atlas connections failed:');
      console.error(atlasError.message);
      process.exit(1); // Stop the server if both fail
    }
  }
};

module.exports = connectDB;
