import 'dotenv/config';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/database.js';

describe('Job Tracker API Tests', () => {
  let createdId;

  test('GET /api/health - should return 200 OK', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
  });

  test('GET /api/applications - should return an array', async () => {
    const response = await request(app).get('/api/applications');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('POST /api/applications - should create a new application', async () => {
    const newApp = {
      company_name: 'Test Company',
      job_title: 'Test Engineer',
      job_type: 'Full-time',
      status: 'Applied',
      applied_date: '2026-06-19',
      notes: 'Test note',
    };

    const response = await request(app)
      .post('/api/applications')
      .send(newApp);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.company_name).toBe('Test Company');

    createdId = response.body.data.id;
  });

  test('GET /api/applications?status=Applied - should filter by status', async () => {
    const response = await request(app).get('/api/applications?status=Applied');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    if (response.body.data.length > 0) {
      response.body.data.forEach((app) => {
        expect(app.status).toBe('Applied');
      });
    }
  });

  test('GET /api/applications/invalid-uuid - should return 400', async () => {
    const response = await request(app).get('/api/applications/999');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.error).toBe('Invalid ID format. Must be a valid UUID');
  });

  test('GET /api/applications/non-existent-uuid - should return 404', async () => {
    const fakeUuid = '00000000-0000-0000-0000-000000000000';
    const response = await request(app).get(`/api/applications/${fakeUuid}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.error).toBe('Application not found');
  });

  test('DELETE /api/applications/:id - should delete the test application', async () => {
    if (!createdId) return;
    const response = await request(app).delete(`/api/applications/${createdId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  });

  // ✅ This closes the database connection so Jest exits properly
  afterAll(async () => {
    await db.close();
  });
});