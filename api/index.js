// Minimal serverless function for Vercel
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle different routes
  const { url, method } = req;

  if (url === '/health' && method === 'GET') {
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'API is working'
    });
  }

  if (url === '/debug' && method === 'GET') {
    return res.status(200).json({
      message: 'Debug endpoint working',
      timestamp: new Date().toISOString(),
      env: {
        nodeEnv: process.env.NODE_ENV || 'not set',
        mongoUri: process.env.MONGODB_URI ? 'set' : 'missing'
      }
    });
  }

  if (url === '/forms/test' && method === 'POST') {
    return res.status(200).json({
      message: 'Forms test endpoint working',
      body: req.body,
      timestamp: new Date().toISOString()
    });
  }

  if (url === '/forms' && method === 'POST') {
    return res.status(201).json({
      success: true,
      message: 'Basic form endpoint working',
      data: req.body,
      timestamp: new Date().toISOString()
    });
  }

  // 404 for unmatched routes
  return res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${method} ${url}`,
    timestamp: new Date().toISOString()
  });
};

