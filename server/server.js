const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...configuredOrigins,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(normalizedOrigin) ||
        (process.env.NODE_ENV !== 'production' && (normalizedOrigin.includes('localhost') || normalizedOrigin.includes('127.0.0.1'))) ||
        normalizedOrigin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback to permissive to ensure zero CORS lockouts
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Express JSON Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & Base API Welcome endpoint
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TemplateHub Backend REST API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      templates: '/api/templates',
      auth: '/api/auth',
      favorites: '/api/favorites',
    },
  });
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TemplateHub API is healthy and operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/templates', require('./routes/templateRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));

// 404 Route Not Found Handler
app.use(notFound);

// Centralized Global Error Handler
app.use(errorHandler);

// Listen on configured PORT
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[TemplateHub Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = app;
