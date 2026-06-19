import express from 'express';
import applicationController from '../controllers/applicationController.js';

const router = express.Router();

/**
 * Application Routes - Maps URLs to controllers
 * Follows MVC pattern: Routes = URL Mapping Layer
 */

// GET /api/applications - List all with filters
router.get('/', applicationController.getApplications);

// GET /api/applications/stats - Get statistics
router.get('/stats', applicationController.getStats);

// GET /api/applications/:id - Get single application
router.get('/:id', applicationController.getApplication);

// POST /api/applications - Create new application
router.post('/', applicationController.createApplication);

// PATCH /api/applications/:id - Update application
router.patch('/:id', applicationController.updateApplication);

// DELETE /api/applications/:id - Delete application
router.delete('/:id', applicationController.deleteApplication);

export default router;