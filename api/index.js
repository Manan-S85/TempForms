const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Simple test endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'API is working'
  });
});

// Simple debug endpoint
app.get('/debug', (req, res) => {
  res.status(200).json({
    message: 'Debug endpoint working',
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV || 'not set',
      mongoUri: process.env.MONGODB_URI ? 'set' : 'missing'
    }
  });
});

// Test forms endpoint
app.post('/forms/test', (req, res) => {
  res.status(200).json({
    message: 'Forms test endpoint working',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// Basic forms endpoint for testing
app.post('/forms', async (req, res) => {
  try {
    // Connect to MongoDB if not connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    }

    res.status(201).json({
      success: true,
      message: 'Basic form endpoint working',
      data: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;