// Built-in crypto for link generation
const crypto = require('crypto');

// Generate secure links
function generateSecureLink(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Calculate expiration date
function calculateExpirationDate(expirationTime, customMinutes) {
  const now = new Date();
  switch (expirationTime) {
    case '15min': return new Date(now.getTime() + 15 * 60 * 1000);
    case '1hour': return new Date(now.getTime() + 60 * 60 * 1000);
    case '24hours': return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'custom': return new Date(now.getTime() + (customMinutes || 60) * 60 * 1000);
    default: return new Date(now.getTime() + 60 * 60 * 1000);
  }
}

// Minimal serverless function for Vercel
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle different routes
  const { url, method } = req;

  if ((url === '/health' || url === '/api/health') && method === 'GET') {
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'API is working'
    });
  }

  if ((url === '/debug' || url === '/api/debug') && method === 'GET') {
    return res.status(200).json({
      message: 'Debug endpoint working',
      timestamp: new Date().toISOString(),
      env: {
        nodeEnv: process.env.NODE_ENV || 'not set',
        mongoUri: process.env.MONGODB_URI ? 'set' : 'missing'
      }
    });
  }

  // Get form by shareable link (demo version)
  if (url.startsWith('/forms/') && method === 'GET') {
    const shareableLink = url.split('/forms/')[1];
    
    if (!shareableLink) {
      return res.status(400).json({ error: 'Shareable link is required' });
    }

    // Demo response - in real version this would fetch from database
    return res.status(200).json({
      success: true,
      form: {
        id: 'demo-form',
        title: 'Demo Form',
        description: 'This is a demo form',
        fields: [
          { id: 'field_1', type: 'text', label: 'Your Name', required: true },
          { id: 'field_2', type: 'textarea', label: 'Comments', required: false }
        ],
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      },
      note: "⚠️  This is a demo response. Database integration coming soon!"
    });
  }

  if ((url === '/forms/test' || url === '/api/forms/test') && method === 'POST') {
    return res.status(200).json({
      message: 'Forms test endpoint working',
      body: req.body,
      timestamp: new Date().toISOString()
    });
  }

  if ((url === '/forms' || url === '/api/forms') && method === 'POST') {
    try {
      // Parse request body
      const { title, description, fields = [], expirationTime = '1hour', customExpirationMinutes } = req.body;

      // Basic validation
      if (!title || title.length === 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Title is required'
        });
      }

      // Generate unique links
      const shareableLink = generateSecureLink(12);
      const responseLink = generateSecureLink(16);

      // Process fields
      const processedFields = fields.map((field, index) => ({
        ...field,
        id: field.id || `field_${index + 1}`
      }));

      // Calculate expiration
      const expiresAt = calculateExpirationDate(expirationTime, customExpirationMinutes);

      // For now, return the form data with links (without saving to DB)
      const formResponse = {
        id: Date.now().toString(), // Temporary ID
        title,
        description,
        shareableLink,
        responseLink,
        expirationTime,
        expiresAt,
        fields: processedFields,
        createdAt: new Date().toISOString()
      };

      // Return response with links
      return res.status(201).json({
        success: true,
        message: 'Form created successfully',
        form: {
          ...formResponse,
          urls: {
            fillForm: `https://stealth-forms.vercel.app/form/${shareableLink}`,
            viewResponses: `https://stealth-forms.vercel.app/responses/${responseLink}`
          }
        },
        note: "⚠️  This is a demo response. Database integration coming soon!"
      });

    } catch (error) {
      console.error('Error creating form:', error);
      return res.status(500).json({
        error: 'Server error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 404 for unmatched routes
  return res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${method} ${url}`,
    timestamp: new Date().toISOString()
  });
};

