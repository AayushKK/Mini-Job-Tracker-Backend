export const up = async (pool) => {
  // Create the trigger function
  await pool.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql'
    `);

  // Attach trigger to the table
  await pool.query(`
        DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
        CREATE TRIGGER update_applications_updated_at 
            BEFORE UPDATE ON applications 
            FOR EACH ROW 
            WHEN (OLD.* IS DISTINCT FROM NEW.*)
            EXECUTE FUNCTION update_updated_at_column()
    `);

  console.log('✅ Created updated_at trigger');
};

export const down = async (pool) => {
  await pool.query(`
        DROP TRIGGER IF EXISTS update_applications_updated_at ON applications
    `);
  await pool.query(`
        DROP FUNCTION IF EXISTS update_updated_at_column CASCADE
    `);
  console.log('✅ Dropped updated_at trigger');
};