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

  // Get form by shareable link (demo version) - handles both /form/ and /forms/ routes
  if ((url.startsWith('/form/') || url.startsWith('/forms/') || url.startsWith('/api/form/') || url.startsWith('/api/forms/')) && method === 'GET') {
    let shareableLink;
    if (url.includes('/api/forms/')) {
      shareableLink = url.split('/api/forms/')[1];
    } else if (url.includes('/api/form/')) {
      shareableLink = url.split('/api/form/')[1];
    } else if (url.startsWith('/forms/')) {
      shareableLink = url.split('/forms/')[1];
    } else {
      shareableLink = url.split('/form/')[1];
    }
    
    if (!shareableLink) {
      return res.status(400).json({ error: 'Shareable link is required' });
    }

    // Demo response - in real version this would fetch from database
    return res.status(200).json({
      success: true,
      form: {
        id: shareableLink,
        title: 'My Test Form',
        description: 'Testing form creation',
        fields: [
          { 
            id: 'field_1', 
            type: 'text', 
            label: 'Your Name', 
            required: true,
            placeholder: 'Enter your full name'
          },
          { 
            id: 'field_2', 
            type: 'textarea', 
            label: 'Comments', 
            required: false,
            placeholder: 'Share your thoughts...'
          }
        ],
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      }
    });
  }

  // Get responses by response link (demo version) - matches frontend /responses/:responseLink route
  if ((url.startsWith('/responses/') || url.startsWith('/api/responses/')) && method === 'GET') {
    const responseLink = url.includes('/api/responses/') ? url.split('/api/responses/')[1] : url.split('/responses/')[1];
    
    if (!responseLink) {
      return res.status(400).json({ error: 'Response link is required' });
    }

    // Demo response data
    return res.status(200).json({
      success: true,
      form: {
        id: responseLink,
        title: 'Sample Form',
        description: 'This is a sample form for demonstration'
      },
      responses: [
        {
          id: 'response_1',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          data: {
            field_1: 'John Doe',
            field_2: 'This is a great form!'
          }
        },
        {
          id: 'response_2',
          submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          data: {
            field_1: 'Jane Smith',
            field_2: 'Very easy to use interface.'
          }
        }
      ],
      totalResponses: 2
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
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      const { title, description, fields = [], expirationTime = '1hour', customExpirationMinutes } = body;

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

  // Submit form response (demo version)
  if ((url.match(/\/forms?\/[^\/]+\/responses$/) || url.match(/\/api\/forms?\/[^\/]+\/responses$/)) && method === 'POST') {
    try {
      const body = req.body || {};
      const { answers } = body;

      if (!answers || typeof answers !== 'object') {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Answers are required'
        });
      }

      // Demo response - in real version this would save to database
      return res.status(201).json({
        success: true,
        message: 'Response submitted successfully!',
        response: {
          id: `response_${Date.now()}`,
          submittedAt: new Date().toISOString(),
          answers: answers
        }
      });

    } catch (error) {
      console.error('Error submitting response:', error);
      return res.status(500).json({
        error: 'Server error',
        message: error.message
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

