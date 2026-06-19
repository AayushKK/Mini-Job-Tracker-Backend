import request from 'supertest';
import app from '../src/app.js';

describe('Job Tracker API', () => {
  let appId;

  // Test: Create application
  test('POST /api/applications - should create a new application', async () => {
    const response = await request(app)
      .post('/api/applications')
      .send({
        company_name: 'Google',
        job_title: 'Software Engineer',
        job_type: 'Full-time',
        status: 'Applied',
        applied_date: '2026-06-15',
        notes: 'Excited!'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.company_name).toBe('Google');

    appId = response.body.data.id;
  });

  // Test: Get all applications
  test('GET /api/applications - should get all applications', async () => {
    const response = await request(app).get('/api/applications');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });


});