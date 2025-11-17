// Application constants and configuration

// Form field types
export const FIELD_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  MULTIPLE_CHOICE: 'multiple-choice',
  YES_NO: 'yes-no',
  RATING: 'rating',
};

// Form expiration options
export const EXPIRATION_OPTIONS = [
  {
    value: '15min',
    label: '15 Minutes',
    description: 'Perfect for quick polls during meetings',
    duration: 15 * 60 * 1000, // milliseconds
    popular: false,
  },
  {
    value: '1hour',
    label: '1 Hour',
    description: 'Great for class surveys or event feedback',
    duration: 60 * 60 * 1000,
    popular: true,
  },
  {
    value: '24hours',
    label: '24 Hours',
    description: 'Ideal for gathering responses over a day',
    duration: 24 * 60 * 60 * 1000,
    popular: true,
  },
  {
    value: 'custom',
    label: 'Custom Time',
    description: 'Set your own expiration time (1 min - 30 days)',
    duration: null,
    popular: false,
  },
];

// Field type configurations
export const FIELD_TYPE_CONFIG = {
  [FIELD_TYPES.TEXT]: {
    label: 'Text Input',
    description: 'Single line text input',
    icon: 'Type',
    maxLength: 1000,
    placeholder: 'Enter your answer...',
    validation: {
      required: false,
      minLength: 0,
      maxLength: 1000,
    },
  },
  [FIELD_TYPES.TEXTAREA]: {
    label: 'Long Text',
    description: 'Multi-line text area',
    icon: 'AlignLeft',
    maxLength: 5000,
    placeholder: 'Enter your detailed response...',
    validation: {
      required: false,
      minLength: 0,
      maxLength: 5000,
    },
  },
  [FIELD_TYPES.MULTIPLE_CHOICE]: {
    label: 'Multiple Choice',
    description: 'Select one or multiple options',
    icon: 'List',
    maxOptions: 20,
    minOptions: 2,
    validation: {
      required: false,
      minOptions: 2,
      maxOptions: 20,
    },
  },
  [FIELD_TYPES.YES_NO]: {
    label: 'Yes/No',
    description: 'Simple yes or no question',
    icon: 'ToggleLeft',
    validation: {
      required: false,
    },
  },
  [FIELD_TYPES.RATING]: {
    label: 'Rating',
    description: 'Numeric rating scale',
    icon: 'Star',
    minRating: 1,
    maxRating: 10,
    defaultMin: 1,
    defaultMax: 5,
    validation: {
      required: false,
      minRating: 1,
      maxRating: 10,
    },
  },
};

// Form validation rules
export const VALIDATION_RULES = {
  form: {
    title: {
      required: true,
      minLength: 1,
      maxLength: 100,
      message: 'Title must be between 1 and 100 characters',
    },
    description: {
      required: false,
      maxLength: 500,
      message: 'Description must be less than 500 characters',
    },
    fields: {
      required: true,
      minFields: 1,
      maxFields: 50,
      message: 'Form must have between 1 and 50 fields',
    },
  },
  field: {
    label: {
      required: true,
      minLength: 1,
      maxLength: 200,
      message: 'Field label must be between 1 and 200 characters',
    },
    placeholder: {
      maxLength: 100,
      message: 'Placeholder must be less than 100 characters',
    },
  },
  response: {
    password: {
      minLength: 4,
      maxLength: 50,
      message: 'Password must be between 4 and 50 characters',
    },
  },
};

// UI Constants
export const UI_CONFIG = {
  // Animation durations (in milliseconds)
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Breakpoints (match Tailwind CSS)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Z-index layers
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },
  
  // Common dimensions
  dimensions: {
    headerHeight: 64,
    footerHeight: 80,
    sidebarWidth: 256,
    maxContentWidth: 1200,
  },
};

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  RECENT_FORMS: 'tempforms_recent_forms',
  USER_PREFERENCES: 'tempforms_user_preferences',
  DRAFT_FORM: 'tempforms_draft_form',
  THEME: 'tempforms_theme',
};

// Default form settings
export const DEFAULT_FORM_SETTINGS = {
  allowMultipleResponses: true,
  showResponseCount: true,
  requireAllFields: false,
  expirationTime: '1hour',
  customExpirationMinutes: 60,
};

// Default field settings
export const DEFAULT_FIELD_SETTINGS = {
  required: false,
  placeholder: '',
  // Type-specific defaults
  rating: {
    minRating: 1,
    maxRating: 5,
  },
  multipleChoice: {
    allowMultipleSelections: false,
    options: [
      { id: 'option1', label: 'Option 1', value: 'option1' },
      { id: 'option2', label: 'Option 2', value: 'option2' },
    ],
  },
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  FORM_NOT_FOUND: 'Form not found or has expired.',
  FORM_EXPIRED: 'This form has expired and is no longer accepting responses.',
  INVALID_LINK: 'The link format is invalid.',
  VALIDATION_ERROR: 'Please correct the errors and try again.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
  UNAUTHORIZED: 'Authentication required.',
  FORBIDDEN: 'Access denied.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  FORM_CREATED: 'Form created successfully!',
  RESPONSE_SUBMITTED: 'Response submitted successfully!',
  FORM_DELETED: 'Form deleted successfully!',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard!',
  PASSWORD_VERIFIED: 'Password verified successfully!',
  EXPORT_STARTED: 'Export started...',
};

// Feature flags
export const FEATURES = {
  EXPORT_CSV: true,
  EXPORT_JSON: true,
  PASSWORD_PROTECTION: true,
  CUSTOM_EXPIRATION: true,
  RATING_FIELDS: true,
  MULTIPLE_CHOICE_MULTIPLE_SELECT: true,
  FORM_ANALYTICS: false, // Future feature
  FORM_TEMPLATES: false, // Future feature
  WEBHOOK_NOTIFICATIONS: false, // Future feature
};

// Regular expressions for validation
export const REGEX_PATTERNS = {
  SHAREABLE_LINK: /^[a-zA-Z0-9]{12}$/,
  RESPONSE_LINK: /^[a-f0-9]{24}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
};

// Color schemes for form themes (future feature)
export const COLOR_SCHEMES = {
  blue: {
    primary: '#0ea5e9',
    secondary: '#3b82f6',
    accent: '#06b6d4',
  },
  green: {
    primary: '#22c55e',
    secondary: '#16a34a',
    accent: '#10b981',
  },
  purple: {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a855f7',
  },
  orange: {
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#f97316',
  },
};

// Form templates (future feature)
export const FORM_TEMPLATES = {
  FEEDBACK: {
    name: 'Feedback Survey',
    description: 'Collect feedback from your audience',
    fields: [
      { type: FIELD_TYPES.RATING, label: 'Overall satisfaction' },
      { type: FIELD_TYPES.TEXTAREA, label: 'What did you like most?' },
      { type: FIELD_TYPES.TEXTAREA, label: 'What could be improved?' },
      { type: FIELD_TYPES.YES_NO, label: 'Would you recommend us?' },
    ],
  },
  POLL: {
    name: 'Quick Poll',
    description: 'Simple poll for quick decisions',
    fields: [
      { type: FIELD_TYPES.MULTIPLE_CHOICE, label: 'What is your preference?' },
      { type: FIELD_TYPES.TEXT, label: 'Any additional comments?' },
    ],
  },
  REGISTRATION: {
    name: 'Event Registration',
    description: 'Collect registration information',
    fields: [
      { type: FIELD_TYPES.TEXT, label: 'Full Name', required: true },
      { type: FIELD_TYPES.TEXT, label: 'Email Address', required: true },
      { type: FIELD_TYPES.MULTIPLE_CHOICE, label: 'Session Preference' },
      { type: FIELD_TYPES.TEXTAREA, label: 'Special Requirements' },
    ],
  },
};

// Analytics events (future feature)
export const ANALYTICS_EVENTS = {
  FORM_CREATED: 'form_created',
  FORM_SHARED: 'form_shared',
  FORM_VIEWED: 'form_viewed',
  RESPONSE_SUBMITTED: 'response_submitted',
  RESPONSES_VIEWED: 'responses_viewed',
  FORM_EXPORTED: 'form_exported',
  FORM_DELETED: 'form_deleted',
};

// Export this as default for easy importing
export default {
  FIELD_TYPES,
  EXPIRATION_OPTIONS,
  FIELD_TYPE_CONFIG,
  VALIDATION_RULES,
  UI_CONFIG,
  API_CONFIG,
  STORAGE_KEYS,
  DEFAULT_FORM_SETTINGS,
  DEFAULT_FIELD_SETTINGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
  REGEX_PATTERNS,
  COLOR_SCHEMES,
  FORM_TEMPLATES,
  ANALYTICS_EVENTS,
};