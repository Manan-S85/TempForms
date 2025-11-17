const crypto = require('crypto');

/**
 * Generate a cryptographically secure random string for form links
 * @param {number} length - Length of the generated string
 * @returns {string} - Secure random string
 */
function generateSecureLink(length = 32) {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

/**
 * Generate a shorter, user-friendly link for sharing
 * @param {number} length - Length of the generated string
 * @returns {string} - User-friendly random string
 */
function generateShareableLink(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    result += chars[randomIndex];
  }
  
  return result;
}

/**
 * Generate both shareable and response links for a form
 * @returns {Object} - Object containing both links
 */
function generateFormLinks() {
  return {
    shareableLink: generateShareableLink(12), // For form filling
    responseLink: generateSecureLink(24)      // For viewing responses (more secure)
  };
}

/**
 * Validate if a link format is correct
 * @param {string} link - Link to validate
 * @param {string} type - Type of link ('shareable' or 'response')
 * @returns {boolean} - Whether the link format is valid
 */
function validateLinkFormat(link, type = 'shareable') {
  if (!link || typeof link !== 'string') {
    return false;
  }
  
  if (type === 'shareable') {
    // Shareable links are 12 characters, alphanumeric
    return /^[a-zA-Z0-9]{12}$/.test(link);
  } else if (type === 'response') {
    // Response links are 24 characters, hexadecimal
    return /^[a-f0-9]{24}$/.test(link);
  }
  
  return false;
}

/**
 * Generate a secure token for additional authentication
 * @param {number} length - Length of the token
 * @returns {string} - Secure token
 */
function generateSecureToken(length = 16) {
  return crypto.randomBytes(length).toString('base64url');
}

/**
 * Hash a password for response viewing protection
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password
 */
function hashPassword(password) {
  if (!password) return null;
  
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  
  return `${salt}:${hash}`;
}

/**
 * Verify a password against its hash
 * @param {string} password - Plain text password to verify
 * @param {string} hashedPassword - Stored hash to verify against
 * @returns {boolean} - Whether the password is correct
 */
function verifyPassword(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  
  try {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    
    return hash === verifyHash;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate a unique field ID for form fields
 * @returns {string} - Unique field ID
 */
function generateFieldId() {
  return `field_${generateShareableLink(8)}`;
}

/**
 * Create a sanitized filename for exports
 * @param {string} formTitle - Original form title
 * @returns {string} - Sanitized filename
 */
function createSafeFilename(formTitle) {
  if (!formTitle) return 'form_responses';
  
  return formTitle
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50) || 'form_responses';
}

module.exports = {
  generateSecureLink,
  generateShareableLink,
  generateFormLinks,
  validateLinkFormat,
  generateSecureToken,
  hashPassword,
  verifyPassword,
  generateFieldId,
  createSafeFilename
};