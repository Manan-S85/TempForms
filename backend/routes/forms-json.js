const express = require('express');
const router = express.Router();
const jsonDB = require('../utils/jsonDatabase');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Create a new form
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('fields').isArray({ min: 1 }).withMessage('At least one field is required'),
  body('expiration').isIn(['15min', '1hour', '24hours', 'custom']).withMessage('Invalid expiration type'),
  body('customExpirationMinutes').optional().isInt({ min: 1, max: 43200 }).withMessage('Custom expiration must be between 1 and 43200 minutes'),
  body('responsePassword').optional().isLength({ min: 1 }).withMessage('Response password cannot be empty if provided')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, description, fields, expiration, customExpirationMinutes, responsePassword } = req.body;

    // Calculate expiration date
    let expirationMinutes;
    switch (expiration) {
      case '15min': expirationMinutes = 15; break;
      case '1hour': expirationMinutes = 60; break;
      case '24hours': expirationMinutes = 24 * 60; break;
      case 'custom': expirationMinutes = customExpirationMinutes; break;
    }

    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    // Hash response password if provided
    let hashedPassword = null;
    if (responsePassword) {
      hashedPassword = await bcrypt.hash(responsePassword, 10);
    }

    // Create form object
    const form = {
      _id: jsonDB.generateId(),
      title: title.trim(),
      description: description?.trim() || '',
      fields: fields.map((field, index) => ({
        id: `field_${index}`,
        ...field
      })),
      shareableLink: jsonDB.generateShareableLink(),
      responseLink: jsonDB.generateShareableLink(),
      responsePassword: hashedPassword,
      expiration,
      customExpirationMinutes,
      createdAt: new Date(),
      expiresAt,
      responseCount: 0
    };

    // Save to JSON database
    const forms = await jsonDB.readForms();
    forms.push(form);
    await jsonDB.writeForms(forms);

    console.log('✅ Form created:', form.title);

    res.status(201).json({
      success: true,
      form: {
        _id: form._id,
        title: form.title,
        description: form.description,
        shareableLink: form.shareableLink,
        responseLink: form.responseLink,
        expiresAt: form.expiresAt,
        hasResponsePassword: !!form.responsePassword
      }
    });

  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create form'
    });
  }
});

// Get form by shareable link (for filling)
router.get('/:shareableLink', async (req, res) => {
  try {
    const { shareableLink } = req.params;
    
    const forms = await jsonDB.readForms();
    const form = forms.find(f => f.shareableLink === shareableLink);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    // Check if form has expired
    if (new Date() > new Date(form.expiresAt)) {
      return res.status(410).json({
        success: false,
        error: 'Form has expired'
      });
    }

    res.json({
      success: true,
      form: {
        _id: form._id,
        title: form.title,
        description: form.description,
        fields: form.fields,
        expiresAt: form.expiresAt,
        responseCount: form.responseCount
      }
    });

  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch form'
    });
  }
});

// Submit form response
router.post('/:shareableLink/responses', [
  body('data').isObject().withMessage('Response data is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { shareableLink } = req.params;
    const { data } = req.body;

    const forms = await jsonDB.readForms();
    const formIndex = forms.findIndex(f => f.shareableLink === shareableLink);
    
    if (formIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    const form = forms[formIndex];

    // Check if form has expired
    if (new Date() > new Date(form.expiresAt)) {
      return res.status(410).json({
        success: false,
        error: 'Form has expired'
      });
    }

    // Create response object
    const response = {
      _id: jsonDB.generateId(),
      formId: form._id,
      data,
      submittedAt: new Date(),
      expiresAt: form.expiresAt
    };

    // Save response
    const responses = await jsonDB.readResponses();
    responses.push(response);
    await jsonDB.writeResponses(responses);

    // Update form response count
    forms[formIndex].responseCount += 1;
    await jsonDB.writeForms(forms);

    console.log('✅ Response submitted for form:', form.title);

    res.status(201).json({
      success: true,
      message: 'Response submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit response'
    });
  }
});

module.exports = router;