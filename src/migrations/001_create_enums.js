export const up = async (pool) => {
  await pool.query(`
        DO $$ BEGIN
            CREATE TYPE job_type_enum AS ENUM ('Internship', 'Full-time', 'Part-time');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
    `);

  await pool.query(`
        DO $$ BEGIN
            CREATE TYPE status_enum AS ENUM ('Applied', 'Interviewing', 'Offer', 'Rejected');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
    `);

  console.log('✅ Created job_type_enum and status_enum');
};

export const down = async (pool) => {
  await pool.query(`DROP TYPE IF EXISTS status_enum CASCADE`);
  await pool.query(`DROP TYPE IF EXISTS job_type_enum CASCADE`);
  console.log('✅ Dropped enums');
};