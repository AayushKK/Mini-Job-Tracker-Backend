export const up = async (pool) => {
  await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_applications_status 
        ON applications(status)
    `);

  await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_applications_applied_date 
        ON applications(applied_date)
    `);

  await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_applications_company_name 
        ON applications(company_name)
    `);

  console.log('✅ Created indexes on applications table');
};

export const down = async (pool) => {
  await pool.query(`DROP INDEX IF EXISTS idx_applications_status`);
  await pool.query(`DROP INDEX IF EXISTS idx_applications_applied_date`);
  await pool.query(`DROP INDEX IF EXISTS idx_applications_company_name`);
  console.log('✅ Dropped indexes');
};