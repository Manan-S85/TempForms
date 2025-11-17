const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'textarea', 'multiple-choice', 'yes-no', 'rating']
  },
  label: {
    type: String,
    required: true,
    maxlength: 200
  },
  placeholder: {
    type: String,
    maxlength: 100
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [{
    id: String,
    label: String,
    value: String
  }], // For multiple-choice fields
  minRating: {
    type: Number,
    min: 1,
    max: 10,
    default: 1
  }, // For rating fields
  maxRating: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  }, // For rating fields
  order: {
    type: Number,
    required: true
  }
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  fields: [fieldSchema],
  shareableLink: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  responseLink: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  responsePassword: {
    type: String, // Hashed password for viewing responses
    default: null
  },
  expirationTime: {
    type: String,
    required: true,
    enum: ['15min', '30min', '1hour', 'custom']
  },
  customExpirationMinutes: {
    type: Number,
    min: 1,
    max: 1440 // Maximum 24 hours in minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index for auto-deletion
  },
  responseCount: {
    type: Number,
    default: 0
  },
  settings: {
    allowMultipleResponses: {
      type: Boolean,
      default: true
    },
    showResponseCount: {
      type: Boolean,
      default: true
    },
    requireAllFields: {
      type: Boolean,
      default: false
    }
  }
});

// Pre-save middleware to calculate expiration date
formSchema.pre('save', function(next) {
  if (this.isNew) {
    const now = new Date();
    
    switch (this.expirationTime) {
      case '15min':
        this.expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
        break;
      case '30min':
        this.expiresAt = new Date(now.getTime() + 30 * 60 * 1000);
        break;
      case '1hour':
        this.expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
        break;
      case 'custom':
        if (!this.customExpirationMinutes) {
          return next(new Error('Custom expiration time requires customExpirationMinutes'));
        }
        this.expiresAt = new Date(now.getTime() + this.customExpirationMinutes * 60 * 1000);
        break;
      default:
        return next(new Error('Invalid expiration time'));
    }
  }
  next();
});

// Virtual for time remaining
formSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const timeLeft = this.expiresAt.getTime() - now.getTime();
  
  if (timeLeft <= 0) {
    return 'Expired';
  }
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
});

// Virtual for checking if form is expired
formSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Virtual for checking if form is about to expire (≤ 2 minutes remaining)
formSchema.virtual('isAboutToExpire').get(function() {
  const now = new Date();
  const timeLeft = this.expiresAt.getTime() - now.getTime();
  return timeLeft > 0 && timeLeft <= (2 * 60 * 1000); // 2 minutes in milliseconds
});

// Instance method to check if form is still active
formSchema.methods.isActive = function() {
  return new Date() < this.expiresAt;
};

// Static method to find active forms
formSchema.statics.findActive = function() {
  return this.find({ expiresAt: { $gt: new Date() } });
};

// Transform output to include virtuals
formSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    // Remove sensitive information
    delete ret.responsePassword;
    return ret;
  }
});

formSchema.set('toObject', { virtuals: true });

// Indexes for performance (most indexes already defined in schema)
formSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Form', formSchema);