require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const goalRoutes = require('./routes/goalRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

// --- Environment setup ---
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

console.log(`🚀 Starting FinanceTracker server in ${process.env.NODE_ENV} mode`);

// --- Validate essential env variables ---
const requiredEnvVars = ['MONGO_URI_PRODUCTION', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please set them in your .env or Render environment');
  process.exit(1);
}

// --- Connect to MongoDB ---
connectDB();

const app = express();

// --- 🌐 Enhanced CORS setup ---
const allowedOrigins = [
  'https://finance-tracker-blush-six.vercel.app', // your Vercel frontend
  'https://financetracker-3u4m.onrender.com',    // your Render backend
  'http://localhost:5173',                       // local dev (Vite)
  'http://localhost:3000'                        // optional for tests
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// ✅ Apply CORS and preflight handling globally
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// --- Debug logging for CORS ---
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  if (req.headers.origin) {
    console.log(`   🌍 Origin: ${req.headers.origin}`);
  }
  next();
});

// --- Middleware ---
app.use(express.json());

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    database: process.env.MONGO_URI_PRODUCTION ? 'connected' : 'not connected',
    time: new Date().toISOString(),
  });
});

// --- Routes ---
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/reports', reportRoutes);

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('🌍 Allowed Origins:', allowedOrigins);
});
