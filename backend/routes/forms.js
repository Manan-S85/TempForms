const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const Response = require('../models/Response');
const { generateFormLinks, generateFieldId, hashPassword } = require('../utils/linkGenerator');
const { 
  validateCreateForm, 
  validateShareableLink,
  sanitizeInput 
} = require('../middleware/validation');
const { createFormLimiter } = require('../middleware/rateLimiter');

/**
 * @route   POST /api/forms
 * @desc    Create a new temporary form
 * @access  Public
 */
router.post('/', createFormLimiter, sanitizeInput, validateCreateForm, async (req, res) => {
  try {
    const {
      title,
      description,
      fields,
      expirationTime,
      customExpirationMinutes,
      responsePassword,
      settings = {}
    } = req.body;

    // Generate unique links
    const { shareableLink, responseLink } = generateFormLinks();

    // Process fields and assign IDs
    const processedFields = fields.map((field, index) => ({
      ...field,
      id: field.id || generateFieldId(),
      order: index
    }));

    // Hash response password if provided
    const hashedPassword = responsePassword ? hashPassword(responsePassword) : null;

    // Create new form
    const newForm = new Form({
      title,
      description,
      fields: processedFields,
      shareableLink,
      responseLink,
      responsePassword: hashedPassword,
      expirationTime,
      customExpirationMinutes,
      settings: {
        allowMultipleResponses: settings.allowMultipleResponses !== false,
        showResponseCount: settings.showResponseCount !== false,
        requireAllFields: settings.requireAllFields === true
      }
    });

    await newForm.save();

    // Log form creation (without sensitive data)
    console.log(`📝 New form created: ${title} (${shareableLink}) - Expires: ${newForm.expiresAt}`);

    res.status(201).json({
      success: true,
      message: 'Form created successfully',
      form: {
        id: newForm._id,
        title: newForm.title,
        description: newForm.description,
        shareableLink: newForm.shareableLink,
        responseLink: newForm.responseLink,
        hasResponsePassword: !!responsePassword,
        expirationTime: newForm.expirationTime,
        expiresAt: newForm.expiresAt,
        timeRemaining: newForm.timeRemaining,
        fields: newForm.fields.map(field => ({
          id: field.id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          options: field.options,
          minRating: field.minRating,
          maxRating: field.maxRating,
          order: field.order
        })),
        settings: newForm.settings,
        createdAt: newForm.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error creating form:', error);

    if (error.code === 11000) {
      // Duplicate key error - very rare but possible
      return res.status(500).json({
        error: 'Generation Error',
        message: 'Failed to generate unique links. Please try again.'
      });
    }

    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to create form. Please try again later.'
    });
  }
});

/**
 * @route   GET /api/forms/:shareableLink
 * @desc    Get form by shareable link for filling
 * @access  Public
 */
router.get('/:shareableLink', validateShareableLink, async (req, res) => {
  try {
    const { shareableLink } = req.params;

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

    // Get response count if setting allows
    let responseCount = 0;
    if (form.settings.showResponseCount) {
      responseCount = await Response.countDocuments({ 
        formId: form._id, 
        isValid: true 
      });
    }

    res.json({
      success: true,
      form: {
        id: form._id,
        title: form.title,
        description: form.description,
        fields: form.fields.sort((a, b) => a.order - b.order).map(field => ({
          id: field.id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          options: field.options,
          minRating: field.minRating,
          maxRating: field.maxRating
        })),
        settings: {
          allowMultipleResponses: form.settings.allowMultipleResponses,
          showResponseCount: form.settings.showResponseCount,
          requireAllFields: form.settings.requireAllFields
        },
        responseCount: form.settings.showResponseCount ? responseCount : null,
        timeRemaining: form.timeRemaining,
        expiresAt: form.expiresAt,
        createdAt: form.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error fetching form:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to load form. Please try again later.'
    });
  }
});

/**
 * @route   GET /api/forms/:shareableLink/info
 * @desc    Get basic form info without full form data
 * @access  Public
 */
router.get('/:shareableLink/info', validateShareableLink, async (req, res) => {
  try {
    const { shareableLink } = req.params;

    const form = await Form.findOne({ shareableLink })
      .select('title description expiresAt createdAt settings responseCount');

    if (!form) {
      return res.status(404).json({
        error: 'Form Not Found',
        message: 'The requested form does not exist or has expired.'
      });
    }

    // Get response count
    const responseCount = await Response.countDocuments({ 
      formId: form._id, 
      isValid: true 
    });

    res.json({
      success: true,
      info: {
        title: form.title,
        description: form.description,
        isExpired: !form.isActive(),
        timeRemaining: form.timeRemaining,
        responseCount: form.settings.showResponseCount ? responseCount : null,
        allowsMultipleResponses: form.settings.allowMultipleResponses,
        createdAt: form.createdAt,
        expiresAt: form.expiresAt
      }
    });

  } catch (error) {
    console.error('❌ Error fetching form info:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to load form information.'
    });
  }
});

/**
 * @route   DELETE /api/forms/:shareableLink
 * @desc    Delete a form (creator only - requires response link as auth)
 * @access  Public (with response link verification)
 */
router.delete('/:shareableLink', validateShareableLink, async (req, res) => {
  try {
    const { shareableLink } = req.params;
    const { responseLink } = req.body;

    if (!responseLink) {
      return res.status(400).json({
        error: 'Authorization Required',
        message: 'Response link is required to delete this form.'
      });
    }

    const form = await Form.findOne({ shareableLink, responseLink });

    if (!form) {
      return res.status(404).json({
        error: 'Form Not Found',
        message: 'Form not found or invalid authorization.'
      });
    }

    // Delete all responses first
    await Response.deleteMany({ formId: form._id });

    // Delete the form
    await Form.findByIdAndDelete(form._id);

    console.log(`🗑️  Form deleted: ${form.title} (${shareableLink})`);

    res.json({
      success: true,
      message: 'Form and all responses have been deleted successfully.'
    });

  } catch (error) {
    console.error('❌ Error deleting form:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete form. Please try again later.'
    });
  }
});

module.exports = router;