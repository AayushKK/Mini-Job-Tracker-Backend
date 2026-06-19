import db from '../config/database.js';

/**
 * Application Model - Handles all database operations
 * Uses UUID as primary key
 */
class Application {
  /**
   * GET /applications
   * Get all applications with optional filters
   */
  static async findAll(filters = {}) {
    const pool = db.getPool();
    let query = `
            SELECT 
                id, 
                company_name, 
                job_title, 
                job_type, 
                status, 
                applied_date, 
                notes, 
                created_at, 
                updated_at
            FROM applications 
            WHERE 1=1
        `;
    const values = [];
    let paramCount = 1;

    // Filter by status
    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    // Search by company name or job title
    if (filters.search) {
      query += ` AND (company_name ILIKE $${paramCount} OR job_title ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ` ORDER BY applied_date DESC, created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * GET /applications/:id
   * Get a single application by UUID
   */
  static async findById(id) {
    const pool = db.getPool();
    const query = `
            SELECT 
                id, 
                company_name, 
                job_title, 
                job_type, 
                status, 
                applied_date, 
                notes, 
                created_at, 
                updated_at
            FROM applications 
            WHERE id = $1
        `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * POST /applications
   * Create a new application (UUID auto-generated)
   */
  static async create(data) {
    const pool = db.getPool();
    const { company_name, job_title, job_type, status, applied_date, notes } = data;

    const query = `
            INSERT INTO applications (
                company_name, 
                job_title, 
                job_type, 
                status, 
                applied_date, 
                notes
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

    const values = [company_name, job_title, job_type, status, applied_date, notes || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * PATCH /applications/:id
   * Update an application partially
   */
  static async update(id, data) {
    const pool = db.getPool();

    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['company_name', 'job_title', 'job_type', 'status', 'applied_date', 'notes'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(data[field]);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `
            UPDATE applications
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * DELETE /applications/:id
   * Delete an application by UUID
   */
  static async delete(id) {
    const pool = db.getPool();
    const query = 'DELETE FROM applications WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * GET /applications/stats
   * Get application statistics
   */
  static async getStats() {
    const pool = db.getPool();
    const query = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'Applied' THEN 1 END) as applied,
                COUNT(CASE WHEN status = 'Interviewing' THEN 1 END) as interviewing,
                COUNT(CASE WHEN status = 'Offer' THEN 1 END) as offer,
                COUNT(CASE WHEN status = 'Rejected' THEN 1 END) as rejected
            FROM applications
        `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  /**
   * Check if application exists by UUID
   */
  static async exists(id) {
    const pool = db.getPool();
    const query = 'SELECT id FROM applications WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }
}

export default Application;