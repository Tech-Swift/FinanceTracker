// Importing required dependencies
require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); //Import custom MongoDB connection
const userRoutes = require('./routes/userRoutes');

dotenv.config();


// Create an Express app
const app = express();
app.use(express.json());


//Adding Routes
app.use('/api/users', userRoutes);

// Middleware to allow parsing of JSON request bodies
app.use(express.json());

// Connect to MongoDB using db.js
connectDB();

// Port number from .env or fallback to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
