require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const goalRoutes = require('./routes/goalRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const reportRoutes = require('./routes/reportRoutes');


dotenv.config();

// Connect to MongoDB first
connectDB();

const app = express();

// Enable CORS for frontend. Use FRONTEND_URL env var for deployed client (Render)
// and allow localhost for local development. Keep credentials: true for cookie auth.
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://financetracker-3u4m.onrender.com',
  'http://localhost:5173'
];
// Log incoming Origin header for debugging blocked CORS requests.
app.use((req, res, next) => {
  if (req.headers && req.headers.origin) {
    console.log('Incoming request Origin header:', req.headers.origin);
  } else {
    console.log('Incoming request with no Origin header (same-origin or non-browser request)');
  }
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // direct match to configured allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // try to parse the origin and inspect hostname to handle ports/trailing slashes
    try {
      const url = new URL(origin);
      const hostname = url.hostname.toLowerCase();

      // allow any Render subdomain by hostname
      if (hostname.endsWith('.onrender.com')) {
        return callback(null, true);
      }

      // also allow if hostname matches any configured allowed origin hostname
      for (const a of allowedOrigins) {
        try {
          const ah = new URL(a).hostname.toLowerCase();
          if (hostname === ah) return callback(null, true);
        } catch (e) {
          // if allowed origin isn't a full URL, compare raw strings
          if (a === origin) return callback(null, true);
        }
      }
    } catch (e) {
      // fallback: normalize origin string by trimming trailing slash and port
      const normalized = origin.replace(/:\d+$/, '').replace(/\/$/, '').toLowerCase();
      if (normalized.endsWith('.onrender.com')) return callback(null, true);
      if (allowedOrigins.indexOf(normalized) !== -1) return callback(null, true);
    }

    // not allowed — log and reject
    console.warn(`Blocked CORS request from origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/reports', reportRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
