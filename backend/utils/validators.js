const validator = require('validator');

// Custom validation functions
const validators = {
  // Validate username format
  isValidUsername: (username) => {
    return /^[a-zA-Z0-9_]{3,30}$/.test(username);
  },

  // Validate password strength
  isStrongPassword: (password) => {
    return password.length >= 6 && 
           /[a-z]/.test(password) && 
           /[A-Z]/.test(password) && 
           /\d/.test(password);
  },

  // Validate language code (ISO 639-1)
  isValidLanguageCode: (code) => {
    const validCodes = [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh',
      'ar', 'hi', 'th', 'vi', 'tr', 'pl', 'nl', 'sv', 'da', 'no'
    ];
    return validCodes.includes(code.toLowerCase());
  },

  // Validate flashcard content
  isValidFlashcardContent: (content) => {
    return content && 
           typeof content === 'string' && 
           content.trim().length > 0 && 
           content.length <= 1000;
  },

  // Validate deck category
  isValidCategory: (category) => {
    const validCategories = [
      'vocabulary', 'phrases', 'grammar', 'pronunciation', 'culture', 'other'
    ];
    return validCategories.includes(category);
  },

  // Validate difficulty level
  isValidDifficulty: (difficulty) => {
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    return validLevels.includes(difficulty);
  },

  // Sanitize user input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    return validator.escape(input.trim());
  },

  // Validate MongoDB ObjectId
  isValidObjectId: (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  // Validate quality score for spaced repetition
  isValidQuality: (quality) => {
    return Number.isInteger(quality) && quality >= 0 && quality <= 5;
  },

  // Validate file upload (for images/audio)
  isValidFileType: (mimetype, allowedTypes = []) => {
    return allowedTypes.includes(mimetype);
  },

  // Validate URL format
  isValidURL: (url) => {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true
    });
  }
};

// Common validation patterns
const patterns = {
  username: /^[a-zA-Z0-9_]{3,30}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
  objectId: /^[0-9a-fA-F]{24}$/,
  languageCode: /^[a-z]{2}$/i
};

// Error messages
const errorMessages = {
  INVALID_USERNAME: 'Username must be 3-30 characters and contain only letters, numbers, and underscores',
  WEAK_PASSWORD: 'Password must be at least 6 characters with uppercase, lowercase, and number',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_LANGUAGE: 'Invalid language code',
  INVALID_CONTENT: 'Content must be between 1-1000 characters',
  INVALID_CATEGORY: 'Invalid category selection',
  INVALID_DIFFICULTY: 'Invalid difficulty level',
  INVALID_OBJECT_ID: 'Invalid ID format',
  INVALID_QUALITY: 'Quality score must be between 0-5',
  INVALID_URL: 'Invalid URL format'
};

module.exports = {
  validators,
  patterns,
  errorMessages
};