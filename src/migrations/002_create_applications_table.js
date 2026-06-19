export const up = async (pool) => {
  // Enable UUID extension
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS applications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            company_name VARCHAR(255) NOT NULL,
            job_title VARCHAR(255) NOT NULL,
            job_type job_type_enum NOT NULL,
            status status_enum NOT NULL DEFAULT 'Applied',
            applied_date DATE NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
  console.log('✅ Created applications table with UUID primary key');
};

export const down = async (pool) => {
  await pool.query(`DROP TABLE IF EXISTS applications CASCADE`);
  console.log('✅ Dropped applications table');
};