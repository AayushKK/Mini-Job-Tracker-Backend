/**
 * Sanitization Utility
 * Centralized sanitization for all inputs
 * Follows MVC pattern: Utils = Helper Functions
 */

/**
 * Sanitize a single value
 * - Trims whitespace
 * - Removes < and > characters (prevents XSS)
 * - Collapses multiple spaces into single space
 */
export const sanitize = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

/**
 * Sanitize application data (for POST/PATCH requests)
 * - company_name: sanitize string
 * - job_title: sanitize string
 * - job_type: pass through (validated elsewhere)
 * - status: pass through (validated elsewhere)
 * - applied_date: pass through (validated elsewhere)
 * - notes: sanitize string
 */
export const sanitizeApplication = (data) => {
  const sanitized = {};

  // Define which fields need sanitization
  const fieldsToSanitize = ['company_name', 'job_title', 'notes'];

  for (const [key, value] of Object.entries(data)) {
    if (fieldsToSanitize.includes(key) && typeof value === 'string') {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Sanitize filter parameters (for GET requests)
 * - status: sanitize string (if provided)
 * - search: sanitize string (if provided)
 */
export const sanitizeFilters = (filters) => {
  const sanitized = {};

  if (filters.status) {
    sanitized.status = sanitize(filters.status);
  }

  if (filters.search) {
    sanitized.search = sanitize(filters.search);
  }

  return sanitized;
};

/**
 * Sanitize ID parameter
 * - Validates UUID format
 */
export const sanitizeId = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return null;
  }
  return id;
};

/**
 * Check if a value is empty after sanitization
 */
export const isEmpty = (value) => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  return false;
};