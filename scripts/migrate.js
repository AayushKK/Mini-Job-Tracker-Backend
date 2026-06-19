#!/usr/bin/env node

import { config } from 'dotenv';
config();

import pkg from 'pg';
const { Pool } = pkg;

import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Migration {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }

  async createMigrationsTable() {
    await this.pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
  }

  async getExecutedMigrations() {
    const result = await this.pool.query('SELECT name FROM migrations ORDER BY id');
    return result.rows.map(row => row.name);
  }

  async runMigration(filePath) {
    // Convert Windows path to file:// URL for ESM import
    const fileUrl = new URL(`file://${filePath.replace(/\\/g, '/')}`);
    const migration = await import(fileUrl);
    const fileName = filePath.split('/').pop().replace('.js', '');

    console.log(`🔄 Running migration: ${fileName}`);

    try {
      await migration.up(this.pool);
      await this.pool.query('INSERT INTO migrations (name) VALUES ($1)', [fileName]);
      console.log(`✅ Migration ${fileName} completed`);
    } catch (err) {
      console.error(`❌ Migration ${fileName} failed:`, err.message);
      throw err;
    }
  }

  async runMigrations() {
    await this.createMigrationsTable();

    const executed = await this.getExecutedMigrations();
    const migrationsPath = join(__dirname, '../src/migrations');
    const migrationFiles = await readdir(migrationsPath);
    const files = migrationFiles
      .filter(file => file.endsWith('.js'))
      .sort();

    let count = 0;
    for (const file of files) {
      const name = file.replace('.js', '');
      if (!executed.includes(name)) {
        const filePath = join(migrationsPath, file);
        await this.runMigration(filePath);
        count++;
      }
    }

    if (count === 0) {
      console.log('✅ No pending migrations');
    } else {
      console.log(`✅ ${count} migration(s) completed`);
    }
  }

  async rollback() {
    await this.createMigrationsTable();

    const executed = await this.getExecutedMigrations();
    if (executed.length === 0) {
      console.log('ℹ️ No migrations to rollback');
      return;
    }

    const lastMigration = executed[executed.length - 1];
    const filePath = join(__dirname, '../src/migrations', `${lastMigration}.js`);

    try {
      const fileUrl = new URL(`file://${filePath.replace(/\\/g, '/')}`);
      const migration = await import(fileUrl);
      await migration.down(this.pool);
      await this.pool.query('DELETE FROM migrations WHERE name = $1', [lastMigration]);
      console.log(`✅ Rollback ${lastMigration} completed`);
    } catch (err) {
      console.error(`❌ Rollback ${lastMigration} failed:`, err.message);
      throw err;
    }
  }

  async close() {
    await this.pool.end();
  }
}

const action = process.argv[2];

const run = async () => {
  const migrator = new Migration();

  try {
    if (action === 'up') {
      await migrator.runMigrations();
    } else if (action === 'down') {
      await migrator.rollback();
    } else {
      console.log('Usage: node scripts/migrate.js up   (or down)');
    }
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await migrator.close();
    process.exit(0);
  }
};

run();