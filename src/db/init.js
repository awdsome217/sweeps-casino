import pool from "../db.js";

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS balances (
      user_id INTEGER REFERENCES users(id),
      gc BIGINT DEFAULT 0,
      sc BIGINT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      type TEXT,
      amount BIGINT,
      currency TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("Database initialized");
  process.exit();
}

init();
