import Application from '../models/Application.js';
import {
  ValidationError,
  NotFoundError,
  asyncHandler
} from '../utils/errorHandler.js';
import {
  validateApplication,
  validateApplicationUpdate,
  validateId,
  validateFilters
} from '../utils/validation.js';
import {
  sanitizeApplication,
  sanitizeFilters
} from '../utils/sanitization.js';

/**
 * Application Controller - Handles HTTP requests and responses
 * Follows MVC pattern: Controller = Business Logic Layer
 */
const applicationController = {
  /**
   * GET /api/applications
   * Get all applications with filters
   */
  getApplications: asyncHandler(async (req, res) => {
    // Sanitize query parameters
    const sanitizedFilters = sanitizeFilters(req.query);
    const { status, search } = sanitizedFilters;

    // Validate filters
    const filterValidation = validateFilters({ status, search });
    if (!filterValidation.valid) {
      throw new ValidationError(filterValidation.errors[0].message);
    }

    const applications = await Application.findAll({
      status: status || undefined,
      search: search || undefined
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  }),

  /**
   * GET /api/applications/:id
   * Get a single application
   */
  getApplication: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID
    const idValidation = validateId(id);
    if (!idValidation.valid) {
      throw new ValidationError(idValidation.message);
    }

    const application = await Application.findById(idValidation.value);

    if (!application) {
      throw new NotFoundError('Application');
    }

    res.status(200).json({
      success: true,
      data: application
    });
  }),

  /**
   * POST /api/applications
   * Create a new application
   */
  createApplication: asyncHandler(async (req, res) => {
    // Sanitize input
    const sanitizedData = sanitizeApplication(req.body);

    // Validate application data
    const validation = validateApplication(sanitizedData);
    if (!validation.valid) {
      throw new ValidationError(validation.errors[0].message);
    }

    const application = await Application.create(sanitizedData);

    res.status(201).json({
      success: true,
      data: application
    });
  }),

  /**
   * PATCH /api/applications/:id
   * Update an application
   */
  updateApplication: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID
    const idValidation = validateId(id);
    if (!idValidation.valid) {
      throw new ValidationError(idValidation.message);
    }

    // Check if application exists
    const exists = await Application.exists(idValidation.value);
    if (!exists) {
      throw new NotFoundError('Application');
    }

    // Sanitize input
    const sanitizedData = sanitizeApplication(req.body);

    // Validate update data
    const validation = validateApplicationUpdate(sanitizedData);
    if (!validation.valid) {
      throw new ValidationError(validation.errors[0].message);
    }

    const application = await Application.update(idValidation.value, sanitizedData);

    res.status(200).json({
      success: true,
      data: application
    });
  }),

  /**
   * DELETE /api/applications/:id
   * Delete an application
   */
  deleteApplication: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID
    const idValidation = validateId(id);
    if (!idValidation.valid) {
      throw new ValidationError(idValidation.message);
    }

    // Check if application exists
    const exists = await Application.exists(idValidation.value);
    if (!exists) {
      throw new NotFoundError('Application');
    }

    await Application.delete(idValidation.value);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  }),

  /**
   * GET /api/applications/stats
   * Get application statistics
   */
  getStats: asyncHandler(async (req, res) => {
    const stats = await Application.getStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  })
};

export default applicationController;