/**
 * Validation Utility
 * Centralized validation for all inputs
 * Follows MVC pattern: Utils = Helper Functions
 */

// Validation rules for different fields
export const VALIDATION_RULES = {
  company_name: {
    required: true,
    minLength: 2,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9\s\-&.,]+$/,
    message: 'Company name must be 1-255 characters and contain only letters, numbers, spaces, and basic punctuation'
  },
  job_title: {
    required: true,
    minLength: 1,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9\s\-&.,]+$/,
    message: 'Job title must be 1-255 characters and contain only letters, numbers, spaces, and basic punctuation'
  },
  job_type: {
    required: true,
    enum: ['Internship', 'Full-time', 'Part-time'],
    message: 'Job type must be: Internship, Full-time, or Part-time'
  },
  status: {
    required: true,
    enum: ['Applied', 'Interviewing', 'Offer', 'Rejected'],
    message: 'Status must be: Applied, Interviewing, Offer, or Rejected'
  },
  applied_date: {
    required: true,
    type: 'date',
    message: 'Applied date must be a valid date'
  },
  notes: {
    required: false,
    maxLength: 1000,
    message: 'Notes must be less than 1000 characters'
  }
};

// Validation result formatter
export const formatValidationErrors = (errors) => {
  return errors.map(err => ({
    field: err.field,
    message: err.message,
    value: err.value
  }));
};

// Validate a single field
export const validateField = (fieldName, value) => {
  const rules = VALIDATION_RULES[fieldName];
  if (!rules) {
    return { valid: true };
  }

  // Check required
  if (rules.required && (value === undefined || value === null || value === '')) {
    return {
      valid: false,
      message: `${fieldName} is required`
    };
  }

  // Skip further validation if not required and value is empty
  if (!rules.required && (value === undefined || value === null || value === '')) {
    return { valid: true };
  }

  // Check min length
  if (rules.minLength && value.length < rules.minLength) {
    return {
      valid: false,
      message: `${fieldName} must be at least ${rules.minLength} characters`
    };
  }

  // Check max length
  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      valid: false,
      message: `${fieldName} must be less than ${rules.maxLength} characters`
    };
  }

  // Check enum
  if (rules.enum && !rules.enum.includes(value)) {
    return {
      valid: false,
      message: rules.message || `${fieldName} must be one of: ${rules.enum.join(', ')}`
    };
  }

  // Check pattern
  if (rules.pattern && !rules.pattern.test(value)) {
    return {
      valid: false,
      message: rules.message || `${fieldName} contains invalid characters`
    };
  }

  // Check date
  if (rules.type === 'date') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return {
        valid: false,
        message: `${fieldName} must be a valid date`
      };
    }
  }

  return { valid: true };
};

// Validate application data
export const validateApplication = (data) => {
  const errors = [];
  const fields = ['company_name', 'job_title', 'job_type', 'status', 'applied_date', 'notes'];

  for (const field of fields) {
    const value = data[field];
    const result = validateField(field, value);
    if (!result.valid) {
      errors.push({
        field,
        message: result.message,
        value: value
      });
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: formatValidationErrors(errors)
    };
  }

  return { valid: true };
};

// Validate update data (only validate provided fields)
export const validateApplicationUpdate = (data) => {
  const errors = [];
  const fields = ['company_name', 'job_title', 'job_type', 'status', 'applied_date', 'notes'];

  for (const field of fields) {
    if (data[field] !== undefined) {
      const value = data[field];
      const result = validateField(field, value);
      if (!result.valid) {
        errors.push({
          field,
          message: result.message,
          value: value
        });
      }
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: formatValidationErrors(errors)
    };
  }

  return { valid: true };
};

// Validate ID parameter (UUID)
export const validateId = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return {
      valid: false,
      message: 'Invalid ID format. Must be a valid UUID'
    };
  }
  return { valid: true, value: id };
};

// Validate filters (status, search)
export const validateFilters = (filters) => {
  const errors = [];

  if (filters.status) {
    const validStatuses = ['Applied', 'Interviewing', 'Offer', 'Rejected'];
    if (!validStatuses.includes(filters.status)) {
      errors.push({
        field: 'status',
        message: 'Status must be: Applied, Interviewing, Offer, or Rejected',
        value: filters.status
      });
    }
  }

  if (filters.search && filters.search.length > 100) {
    errors.push({
      field: 'search',
      message: 'Search term must be less than 100 characters',
      value: filters.search
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: formatValidationErrors(errors)
    };
  }

  return { valid: true };
};