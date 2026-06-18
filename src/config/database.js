import pkg from 'pg';
const { Pool } = pkg;

/**
 * Database Configuration for Neon PostgreSQL
 * Follows MVC pattern: Config = Database Layer
 */
class Database {
  constructor() {
    this.pool = null;
  }

  // Initialize connection pool
  connect() {
    if (this.pool) {
      return this.pool;
    }

    // Use DATABASE_URL from Neon
    if (process.env.DATABASE_URL) {
      console.log('🔌 Connecting to Neon PostgreSQL via DATABASE_URL');
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false // Required for Neon
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else {
      // Fallback to individual parameters
      console.log('🔌 Connecting via individual parameters');
      this.pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'jobtracker',
        ssl: process.env.DB_SSL === 'true' ? {
          rejectUnauthorized: false
        } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    }

    return this.pool;
  }

  // Test database connection
  async testConnection() {
    try {
      const pool = this.connect();
      const client = await pool.connect();
      const result = await client.query('SELECT NOW() as current_time, version() as version');
      console.log('✅ Connected to Neon PostgreSQL');
      console.log(`📅 Database time: ${result.rows[0].current_time}`);
      console.log(`📦 PostgreSQL version: ${result.rows[0].version}`);
      client.release();
      return true;
    } catch (err) {
      console.error('❌ Database connection failed:', err.message);
      console.error('💡 Please check your DATABASE_URL in .env file');
      return false;
    }
  }



  // Get pool instance
  getPool() {
    return this.connect();
  }

  // Close database connection
  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('✅ Database connection closed');
    }
  }
}

// Export singleton instance
export default new Database();