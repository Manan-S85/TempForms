const { body, validationResult } = require('express-validator');
const { validateLinkFormat } = require('../utils/linkGenerator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

/**
 * Validation rules for creating a new form
 */
const validateCreateForm = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('expirationTime')
    .isIn(['15min', '1hour', '24hours', 'custom'])
    .withMessage('Invalid expiration time'),
  
  body('customExpirationMinutes')
    .if(body('expirationTime').equals('custom'))
    .isInt({ min: 1, max: 43200 })
    .withMessage('Custom expiration must be between 1 minute and 30 days'),
  
  body('responsePassword')
    .optional()
    .isLength({ min: 4, max: 50 })
    .withMessage('Response password must be between 4 and 50 characters'),
  
  body('fields')
    .isArray({ min: 1, max: 50 })
    .withMessage('Form must have between 1 and 50 fields'),
  
  body('fields.*.type')
    .isIn(['text', 'textarea', 'multiple-choice', 'yes-no', 'rating'])
    .withMessage('Invalid field type'),
  
  body('fields.*.label')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Field label must be between 1 and 200 characters'),
  
  body('fields.*.required')
    .optional()
    .isBoolean()
    .withMessage('Required field must be boolean'),
  
  body('fields.*.options')
    .if(body('fields.*.type').equals('multiple-choice'))
    .isArray({ min: 2, max: 20 })
    .withMessage('Multiple choice fields must have between 2 and 20 options'),
  
  body('fields.*.options.*.label')
    .if(body('fields.*.type').equals('multiple-choice'))
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option label must be between 1 and 100 characters'),
  
  body('fields.*.minRating')
    .if(body('fields.*.type').equals('rating'))
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Minimum rating must be between 1 and 10'),
  
  body('fields.*.maxRating')
    .if(body('fields.*.type').equals('rating'))
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Maximum rating must be between 1 and 10'),
  
  body('settings.allowMultipleResponses')
    .optional()
    .isBoolean()
    .withMessage('Allow multiple responses must be boolean'),
  
  body('settings.showResponseCount')
    .optional()
    .isBoolean()
    .withMessage('Show response count must be boolean'),
  
  body('settings.requireAllFields')
    .optional()
    .isBoolean()
    .withMessage('Require all fields must be boolean'),
  
  handleValidationErrors
];

/**
 * Validation rules for submitting a form response
 */
const validateFormResponse = [
  body('answers')
    .isObject()
    .withMessage('Answers must be an object'),
  
  // Custom validation for answers will be done in the route handler
  // since it depends on the form schema
  
  handleValidationErrors
];

/**
 * Validation rules for response password
 */
const validateResponsePassword = [
  body('password')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Password must be between 1 and 50 characters'),
  
  handleValidationErrors
];

/**
 * Middleware to validate shareable link format
 */
const validateShareableLink = (req, res, next) => {
  const { shareableLink } = req.params;
  
  if (!validateLinkFormat(shareableLink, 'shareable')) {
    return res.status(400).json({
      error: 'Invalid Link Format',
      message: 'The provided link format is invalid'
    });
  }
  
  next();
};

/**
 * Middleware to validate response link format
 */
const validateResponseLink = (req, res, next) => {
  const { responseLink } = req.params;
  
  if (!validateLinkFormat(responseLink, 'response')) {
    return res.status(400).json({
      error: 'Invalid Link Format',
      message: 'The provided response link format is invalid'
    });
  }
  
  next();
};

/**
 * Custom validator for field-specific answer validation
 */
const validateAnswerForField = (answer, field) => {
  const errors = [];
  
  // Check if required field is provided
  if (field.required && (answer === undefined || answer === null || answer === '')) {
    errors.push(`Field "${field.label}" is required`);
    return errors;
  }
  
  // If field is not required and no answer provided, skip validation
  if (answer === undefined || answer === null || answer === '') {
    return errors;
  }
  
  // Type-specific validation
  switch (field.type) {
    case 'text':
      if (typeof answer !== 'string') {
        errors.push(`Field "${field.label}" must be text`);
      } else if (answer.length > 1000) {
        errors.push(`Field "${field.label}" is too long (max 1000 characters)`);
      }
      break;
      
    case 'textarea':
      if (typeof answer !== 'string') {
        errors.push(`Field "${field.label}" must be text`);
      } else if (answer.length > 5000) {
        errors.push(`Field "${field.label}" is too long (max 5000 characters)`);
      }
      break;
      
    case 'multiple-choice':
      const validOptions = field.options.map(opt => opt.value);
      
      if (Array.isArray(answer)) {
        // Multiple selections
        const invalidOptions = answer.filter(val => !validOptions.includes(val));
        if (invalidOptions.length > 0) {
          errors.push(`Invalid options for "${field.label}": ${invalidOptions.join(', ')}`);
        }
      } else {
        // Single selection
        if (!validOptions.includes(answer)) {
          errors.push(`Invalid option for "${field.label}": ${answer}`);
        }
      }
      break;
      
    case 'yes-no':
      const validYesNoValues = ['yes', 'no', true, false, 'true', 'false'];
      if (!validYesNoValues.includes(answer)) {
        errors.push(`Field "${field.label}" must be yes or no`);
      }
      break;
      
    case 'rating':
      const rating = Number(answer);
      const minRating = field.minRating || 1;
      const maxRating = field.maxRating || 5;
      
      if (isNaN(rating) || rating < minRating || rating > maxRating) {
        errors.push(`Field "${field.label}" must be between ${minRating} and ${maxRating}`);
      }
      break;
      
    default:
      errors.push(`Unknown field type: ${field.type}`);
  }
  
  return errors;
};

/**
 * Middleware to sanitize input data
 */
const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS or injection attempts
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  };
  
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };
  
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

module.exports = {
  validateCreateForm,
  validateFormResponse,
  validateResponsePassword,
  validateShareableLink,
  validateResponseLink,
  validateAnswerForField,
  sanitizeInput,
  handleValidationErrors
};