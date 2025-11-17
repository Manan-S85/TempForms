const mongoose = require('mongoose');
const crypto = require('crypto');

// Simple Form Schema
const FormSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  fields: [{
    id: String,
    type: { type: String, enum: ['text', 'textarea', 'multiple-choice', 'yes-no', 'rating'] },
    label: String,
    required: Boolean,
    options: [{ id: String, label: String, value: String }]
  }],
  shareableLink: { type: String, unique: true, index: true },
  responseLink: { type: String, unique: true, index: true },
  expirationTime: { type: String, enum: ['15min', '1hour', '24hours', 'custom'] },
  customExpirationMinutes: Number,
  expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
  createdAt: { type: Date, default: Date.now }
});

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

  // Get form by shareable link
  if (url.startsWith('/forms/') && method === 'GET') {
    try {
      const shareableLink = url.split('/forms/')[1];
      
      if (!shareableLink) {
        return res.status(400).json({ error: 'Shareable link is required' });
      }

      // Connect to MongoDB if not connected  
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI);
      }

      const Form = mongoose.models.Form || mongoose.model('Form', FormSchema);
      const form = await Form.findOne({ shareableLink });

      if (!form) {
        return res.status(404).json({ 
          error: 'Form not found',
          message: 'This form may have expired or does not exist'
        });
      }

      return res.status(200).json({
        success: true,
        form: {
          id: form._id,
          title: form.title,
          description: form.description,
          fields: form.fields,
          expiresAt: form.expiresAt
        }
      });

    } catch (error) {
      console.error('Error fetching form:', error);
      return res.status(500).json({
        error: 'Server error',
        message: error.message
      });
    }
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
      // Connect to MongoDB if not connected
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
      }

      // Get Form model
      const Form = mongoose.models.Form || mongoose.model('Form', FormSchema);

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
      let shareableLink, responseLink;
      let attempts = 0;
      do {
        shareableLink = generateSecureLink(12);
        responseLink = generateSecureLink(16);
        attempts++;
      } while (attempts < 5); // Simple retry logic

      // Process fields
      const processedFields = fields.map((field, index) => ({
        ...field,
        id: field.id || `field_${index + 1}`
      }));

      // Calculate expiration
      const expiresAt = calculateExpirationDate(expirationTime, customExpirationMinutes);

      // Create form
      const newForm = new Form({
        title,
        description,
        fields: processedFields,
        shareableLink,
        responseLink,
        expirationTime,
        customExpirationMinutes,
        expiresAt
      });

      await newForm.save();

      // Return response with links
      return res.status(201).json({
        success: true,
        message: 'Form created successfully',
        form: {
          id: newForm._id,
          title: newForm.title,
          description: newForm.description,
          shareableLink: newForm.shareableLink,
          responseLink: newForm.responseLink,
          expirationTime: newForm.expirationTime,
          expiresAt: newForm.expiresAt,
          fields: newForm.fields,
          urls: {
            fillForm: `https://stealth-forms.vercel.app/form/${newForm.shareableLink}`,
            viewResponses: `https://stealth-forms.vercel.app/responses/${newForm.responseLink}`
          }
        }
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

