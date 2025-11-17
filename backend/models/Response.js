const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
    index: true
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  submitterInfo: {
    ip: String,
    userAgent: String,
    // No personal identifying information stored for privacy
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index for auto-deletion
  },
  isValid: {
    type: Boolean,
    default: true
  }
});

// Pre-save middleware to set expiration date based on parent form
responseSchema.pre('save', async function(next) {
  if (this.isNew && !this.expiresAt) {
    try {
      const Form = mongoose.model('Form');
      const form = await Form.findById(this.formId);
      
      if (!form) {
        return next(new Error('Associated form not found'));
      }
      
      // Response expires at the same time as the form
      this.expiresAt = form.expiresAt;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Instance method to get formatted answers
responseSchema.methods.getFormattedAnswers = function() {
  const formatted = {};
  
  for (const [fieldId, answer] of this.answers.entries()) {
    formatted[fieldId] = answer;
  }
  
  return formatted;
};

// Instance method to validate response against form schema
responseSchema.methods.validateAgainstForm = async function() {
  try {
    const Form = mongoose.model('Form');
    const form = await Form.findById(this.formId);
    
    if (!form) {
      throw new Error('Form not found');
    }
    
    if (!form.isActive()) {
      throw new Error('Form has expired');
    }
    
    const errors = [];
    
    // Check required fields
    for (const field of form.fields) {
      if (field.required && !this.answers.has(field.id)) {
        errors.push(`Field "${field.label}" is required`);
      }
    }
    
    // Validate field types and values
    for (const [fieldId, answer] of this.answers.entries()) {
      const field = form.fields.find(f => f.id === fieldId);
      
      if (!field) {
        errors.push(`Unknown field: ${fieldId}`);
        continue;
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
          if (Array.isArray(answer)) {
            // Multiple selections
            const validOptions = field.options.map(opt => opt.value);
            const invalidOptions = answer.filter(val => !validOptions.includes(val));
            if (invalidOptions.length > 0) {
              errors.push(`Invalid options for "${field.label}": ${invalidOptions.join(', ')}`);
            }
          } else {
            // Single selection
            const validOptions = field.options.map(opt => opt.value);
            if (!validOptions.includes(answer)) {
              errors.push(`Invalid option for "${field.label}": ${answer}`);
            }
          }
          break;
          
        case 'yes-no':
          if (!['yes', 'no', true, false].includes(answer)) {
            errors.push(`Field "${field.label}" must be yes/no`);
          }
          break;
          
        case 'rating':
          const rating = Number(answer);
          if (isNaN(rating) || rating < field.minRating || rating > field.maxRating) {
            errors.push(`Field "${field.label}" must be between ${field.minRating} and ${field.maxRating}`);
          }
          break;
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [error.message]
    };
  }
};

// Static method to get response statistics for a form
responseSchema.statics.getFormStats = async function(formId) {
  try {
    const stats = await this.aggregate([
      { $match: { formId: mongoose.Types.ObjectId(formId), isValid: true } },
      {
        $group: {
          _id: null,
          totalResponses: { $sum: 1 },
          firstResponse: { $min: '$submittedAt' },
          lastResponse: { $max: '$submittedAt' },
          avgResponseTime: { $avg: { $subtract: ['$submittedAt', '$createdAt'] } }
        }
      }
    ]);
    
    return stats[0] || {
      totalResponses: 0,
      firstResponse: null,
      lastResponse: null,
      avgResponseTime: 0
    };
  } catch (error) {
    console.error('Error calculating form stats:', error);
    return {
      totalResponses: 0,
      firstResponse: null,
      lastResponse: null,
      avgResponseTime: 0
    };
  }
};

// Transform output to clean up data
responseSchema.set('toJSON', {
  transform: function(doc, ret) {
    // Convert Map to plain object for JSON serialization
    if (ret.answers instanceof Map) {
      ret.answers = Object.fromEntries(ret.answers);
    }
    
    // Remove sensitive information
    delete ret.submitterInfo;
    
    return ret;
  }
});

// Indexes for performance (expiresAt index already defined in schema with TTL)
responseSchema.index({ formId: 1, submittedAt: -1 });
responseSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Response', responseSchema);