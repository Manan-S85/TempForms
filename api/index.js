const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes with error handling
let formRoutes, responseRoutes;
try {
  formRoutes = require('../backend/routes/forms');
  responseRoutes = require('../backend/routes/responses');
  console.log('✅ Routes imported successfully');
} catch (error) {
  console.error('❌ Error importing routes:', error);
  throw error;
}

const app = express();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const createFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit form creation to 10 per hour per IP
  message: {
    error: 'Too many forms created from this IP, please try again later.',
    retryAfter: '1 hour'
  }
});

app.use(limiter);
app.use('/forms', createFormLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tempforms')
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('🗄️  Database:', mongoose.connection.db.databaseName);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV,
    mongoUri: process.env.MONGODB_URI ? 'set' : 'missing'
  });
});

// Debug endpoint
app.get('/debug', (req, res) => {
  res.status(200).json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      readyState: mongoose.connection.readyState,
      states: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }
    },
    env: {
      mongoUri: process.env.MONGODB_URI ? 'set' : 'missing',
      nodeEnv: process.env.NODE_ENV || 'not set'
    }
  });
});

// Simple test endpoint for forms
app.post('/forms/test', (req, res) => {
  try {
    res.status(200).json({
      message: 'Forms endpoint is reachable',
      body: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Test endpoint error',
      message: error.message
    });
  }
});

// Debug middleware for forms
app.use('/forms', (req, res, next) => {
  console.log(`📝 Forms route: ${req.method} ${req.originalUrl}`);
  console.log('Body:', req.body);
  next();
});

// API routes
app.use('/forms', formRoutes);
app.use('/responses', responseRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('💥 Unhandled error:', error);
  console.error('Request URL:', req.originalUrl);
  console.error('Request method:', req.method);
  console.error('Request body:', req.body);
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

module.exports = app;