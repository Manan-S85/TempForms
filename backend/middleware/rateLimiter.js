const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip} - ${req.method} ${req.path}`);
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Form creation rate limiter (more restrictive)
const createFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit form creation to 10 per hour per IP
  message: {
    error: 'Form creation limit exceeded',
    message: 'Too many forms created from this IP, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`Form creation rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Form creation limit exceeded',
      message: 'You have created too many forms. Please wait before creating another one.',
      retryAfter: '1 hour'
    });
  }
});

// Form submission rate limiter
const submitResponseLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit submissions to 20 per 5 minutes per IP
  message: {
    error: 'Submission rate limit exceeded',
    message: 'Too many form submissions from this IP, please try again later.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`Form submission rate limit exceeded for IP: ${req.ip} - Form: ${req.params.shareableLink}`);
    res.status(429).json({
      error: 'Submission rate limit exceeded',
      message: 'Too many submissions. Please wait before submitting again.',
      retryAfter: '5 minutes'
    });
  }
});

// Response viewing rate limiter
const viewResponsesLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit response viewing to 50 per 10 minutes per IP
  message: {
    error: 'Response viewing limit exceeded',
    message: 'Too many response viewing requests from this IP, please try again later.',
    retryAfter: '10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`Response viewing rate limit exceeded for IP: ${req.ip} - Response link: ${req.params.responseLink}`);
    res.status(429).json({
      error: 'Response viewing limit exceeded',
      message: 'Too many response viewing requests. Please wait before trying again.',
      retryAfter: '10 minutes'
    });
  }
});

// Strict rate limiter for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Very restrictive - 5 requests per hour
  message: {
    error: 'Strict rate limit exceeded',
    message: 'This operation is heavily rate limited. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Dynamic rate limiter based on form popularity
const createDynamicFormLimiter = (baseMax = 10, baseWindow = 60 * 60 * 1000) => {
  return rateLimit({
    windowMs: baseWindow,
    max: (req) => {
      // Could implement logic to adjust limits based on:
      // - Time of day
      // - Server load
      // - User behavior patterns
      return baseMax;
    },
    message: {
      error: 'Dynamic rate limit exceeded',
      message: 'Rate limit adjusted based on current usage. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Skip rate limiting for certain conditions
const skipSuccessfulRequests = (req, res) => {
  // Skip rate limiting if the request was successful
  return res.statusCode < 400;
};

const skipFailedRequests = (req, res) => {
  // Only count failed requests toward the rate limit
  return res.statusCode < 400;
};

// Custom rate limiter with logging
const createCustomLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const identifier = req.ip;
      const timestamp = new Date().toISOString();
      
      console.log(`[${timestamp}] Rate limit exceeded:`, {
        ip: identifier,
        method: req.method,
        path: req.path,
        userAgent: req.get('User-Agent'),
        limit: options.max || 100,
        window: `${(options.windowMs || 15 * 60 * 1000) / 1000 / 60} minutes`
      });
      
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please slow down and try again later.',
        details: {
          limit: options.max || 100,
          windowMinutes: (options.windowMs || 15 * 60 * 1000) / 1000 / 60,
          retryAfter: `${(options.windowMs || 15 * 60 * 1000) / 1000 / 60} minutes`
        }
      });
    }
  };
  
  return rateLimit({ ...defaultOptions, ...options });
};

module.exports = {
  apiLimiter,
  createFormLimiter,
  submitResponseLimiter,
  viewResponsesLimiter,
  strictLimiter,
  createDynamicFormLimiter,
  createCustomLimiter,
  skipSuccessfulRequests,
  skipFailedRequests
};