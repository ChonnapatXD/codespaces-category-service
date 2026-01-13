const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  allowExitOnIdle: true
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected via PgBouncer");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err);
});

module.exports = pool;
