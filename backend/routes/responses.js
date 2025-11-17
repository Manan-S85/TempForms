const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const Response = require('../models/Response');
const { verifyPassword } = require('../utils/linkGenerator');
const { 
  validateFormResponse, 
  validateResponsePassword,
  validateShareableLink,
  validateResponseLink,
  validateAnswerForField,
  sanitizeInput 
} = require('../middleware/validation');
const { submitResponseLimiter, viewResponsesLimiter } = require('../middleware/rateLimiter');

/**
 * @route   POST /api/forms/:shareableLink/responses
 * @desc    Submit a response to a form
 * @access  Public
 */
router.post('/:shareableLink/responses', 
  submitResponseLimiter, 
  validateShareableLink,
  sanitizeInput,
  validateFormResponse,
  async (req, res) => {
    try {
      const { shareableLink } = req.params;
      const { answers } = req.body;

      // Find the form
      const form = await Form.findOne({ shareableLink });

      if (!form) {
        return res.status(404).json({
          error: 'Form Not Found',
          message: 'The requested form does not exist or has expired.'
        });
      }

      // Check if form is expired
      if (!form.isActive()) {
        return res.status(410).json({
          error: 'Form Expired',
          message: 'This form has expired and is no longer accepting responses.',
          expiredAt: form.expiresAt
        });
      }

      // Validate answers against form schema
      const validationErrors = [];
      const processedAnswers = new Map();

      // Check all form fields
      for (const field of form.fields) {
        const answer = answers[field.id];
        const fieldErrors = validateAnswerForField(answer, field);
        
        if (fieldErrors.length > 0) {
          validationErrors.push(...fieldErrors);
        } else if (answer !== undefined && answer !== null && answer !== '') {
          // Store valid answers
          processedAnswers.set(field.id, answer);
        }
      }

      // Check for unknown fields in answers
      for (const fieldId in answers) {
        const fieldExists = form.fields.some(field => field.id === fieldId);
        if (!fieldExists) {
          validationErrors.push(`Unknown field: ${fieldId}`);
        }
      }

      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Please correct the following errors:',
          details: validationErrors
        });
      }

      // Check if multiple responses are allowed
      if (!form.settings.allowMultipleResponses) {
        const existingResponse = await Response.findOne({
          formId: form._id,
          'submitterInfo.ip': req.ip,
          isValid: true
        });

        if (existingResponse) {
          return res.status(409).json({
            error: 'Multiple Responses Not Allowed',
            message: 'You have already submitted a response to this form.',
            submittedAt: existingResponse.submittedAt
          });
        }
      }

      // Create new response
      const newResponse = new Response({
        formId: form._id,
        answers: processedAnswers,
        submitterInfo: {
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      await newResponse.save();

      // Update form response count
      await Form.findByIdAndUpdate(form._id, {
        $inc: { responseCount: 1 }
      });

      console.log(`📝 New response submitted to form: ${form.title} (${shareableLink})`);

      res.status(201).json({
        success: true,
        message: 'Response submitted successfully',
        response: {
          id: newResponse._id,
          submittedAt: newResponse.submittedAt,
          answers: Object.fromEntries(newResponse.answers)
        },
        form: {
          title: form.title,
          responseLink: form.responseLink,
          hasResponsePassword: !!form.responsePassword
        }
      });

    } catch (error) {
      console.error('❌ Error submitting response:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to submit response. Please try again later.'
      });
    }
  }
);

/**
 * @route   GET /api/responses/:responseLink
 * @desc    Get all responses for a form
 * @access  Public (with optional password protection)
 */
router.get('/:responseLink', 
  viewResponsesLimiter,
  validateResponseLink,
  async (req, res) => {
    try {
      const { responseLink } = req.params;
      const { password } = req.query;

      // Find the form
      const form = await Form.findOne({ responseLink });

      if (!form) {
        return res.status(404).json({
          error: 'Response Link Not Found',
          message: 'The requested response link does not exist or has expired.'
        });
      }

      // Check if form is expired
      if (!form.isActive()) {
        return res.status(410).json({
          error: 'Form Expired',
          message: 'This form has expired and responses are no longer available.',
          expiredAt: form.expiresAt
        });
      }

      // Check password if required
      if (form.responsePassword) {
        if (!password) {
          return res.status(401).json({
            error: 'Password Required',
            message: 'This form requires a password to view responses.',
            requiresPassword: true
          });
        }

        if (!verifyPassword(password, form.responsePassword)) {
          return res.status(401).json({
            error: 'Invalid Password',
            message: 'The provided password is incorrect.',
            requiresPassword: true
          });
        }
      }

      // Get all responses
      const responses = await Response.find({ 
        formId: form._id, 
        isValid: true 
      })
        .sort({ submittedAt: -1 })
        .select('-submitterInfo -__v');

      // Get response statistics
      const stats = {
        totalResponses: responses.length,
        firstResponse: responses.length > 0 ? responses[responses.length - 1].submittedAt : null,
        lastResponse: responses.length > 0 ? responses[0].submittedAt : null
      };

      // Format responses for better readability
      const formattedResponses = responses.map(response => ({
        id: response._id,
        submittedAt: response.submittedAt,
        answers: Object.fromEntries(response.answers),
        // Add field labels for better context
        formattedAnswers: formatAnswersWithLabels(Object.fromEntries(response.answers), form.fields)
      }));

      res.json({
        success: true,
        form: {
          id: form._id,
          title: form.title,
          description: form.description,
          shareableLink: form.shareableLink,
          timeRemaining: form.timeRemaining,
          expiresAt: form.expiresAt,
          createdAt: form.createdAt,
          fields: form.fields.sort((a, b) => a.order - b.order)
        },
        responses: formattedResponses,
        statistics: stats
      });

    } catch (error) {
      console.error('❌ Error fetching responses:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to load responses. Please try again later.'
      });
    }
  }
);

/**
 * @route   POST /api/responses/:responseLink/verify-password
 * @desc    Verify password for response viewing
 * @access  Public
 */
router.post('/:responseLink/verify-password',
  validateResponseLink,
  validateResponsePassword,
  async (req, res) => {
    try {
      const { responseLink } = req.params;
      const { password } = req.body;

      const form = await Form.findOne({ responseLink });

      if (!form) {
        return res.status(404).json({
          error: 'Response Link Not Found',
          message: 'The requested response link does not exist.'
        });
      }

      if (!form.responsePassword) {
        return res.status(400).json({
          error: 'No Password Required',
          message: 'This form does not require a password.'
        });
      }

      const isValid = verifyPassword(password, form.responsePassword);

      res.json({
        success: true,
        passwordValid: isValid,
        message: isValid ? 'Password is correct' : 'Password is incorrect'
      });

    } catch (error) {
      console.error('❌ Error verifying password:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to verify password. Please try again later.'
      });
    }
  }
);

/**
 * @route   GET /api/responses/:responseLink/export
 * @desc    Export responses as CSV or JSON
 * @access  Public (with password protection if required)
 */
router.get('/:responseLink/export',
  validateResponseLink,
  async (req, res) => {
    try {
      const { responseLink } = req.params;
      const { password, format = 'json' } = req.query;

      const form = await Form.findOne({ responseLink });

      if (!form) {
        return res.status(404).json({
          error: 'Response Link Not Found',
          message: 'The requested response link does not exist or has expired.'
        });
      }

      // Check password if required
      if (form.responsePassword && !verifyPassword(password, form.responsePassword)) {
        return res.status(401).json({
          error: 'Invalid Password',
          message: 'Password is required to export responses.'
        });
      }

      // Get responses
      const responses = await Response.find({ 
        formId: form._id, 
        isValid: true 
      }).sort({ submittedAt: -1 });

      if (format.toLowerCase() === 'csv') {
        // Generate CSV
        const csv = generateCSV(responses, form.fields);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv"`);
        res.send(csv);
      } else {
        // Return JSON
        const exportData = {
          form: {
            title: form.title,
            description: form.description,
            createdAt: form.createdAt,
            expiresAt: form.expiresAt
          },
          responses: responses.map(response => ({
            submittedAt: response.submittedAt,
            answers: Object.fromEntries(response.answers)
          })),
          exportedAt: new Date().toISOString(),
          totalResponses: responses.length
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.json"`);
        res.json(exportData);
      }

    } catch (error) {
      console.error('❌ Error exporting responses:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to export responses. Please try again later.'
      });
    }
  }
);

/**
 * Helper function to format answers with field labels
 */
function formatAnswersWithLabels(answers, fields) {
  const formatted = {};
  
  for (const field of fields) {
    const answer = answers[field.id];
    if (answer !== undefined) {
      formatted[field.label] = {
        value: answer,
        type: field.type,
        fieldId: field.id
      };
    }
  }
  
  return formatted;
}

/**
 * Helper function to generate CSV from responses
 */
function generateCSV(responses, fields) {
  if (responses.length === 0) {
    return 'No responses available';
  }

  // Create header row
  const headers = ['Submitted At', ...fields.map(field => field.label)];
  let csv = headers.map(header => `"${header}"`).join(',') + '\n';

  // Add data rows
  for (const response of responses) {
    const row = [response.submittedAt.toISOString()];
    
    for (const field of fields) {
      const answer = response.answers.get(field.id) || '';
      let formattedAnswer = '';
      
      if (Array.isArray(answer)) {
        formattedAnswer = answer.join('; ');
      } else {
        formattedAnswer = String(answer);
      }
      
      row.push(`"${formattedAnswer.replace(/"/g, '""')}"`);
    }
    
    csv += row.join(',') + '\n';
  }

  return csv;
}

module.exports = router;