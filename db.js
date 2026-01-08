const { Pool } = require("pg");

// WRITE → MASTER
const writePool = new Pool({
  connectionString: process.env.DATABASE_WRITE_URL,
});

const readPool = new Pool({
  connectionString: process.env.DATABASE_READ_URL,
});

writePool.on("connect", () => {
  console.log("✅ PostgreSQL MASTER connected");
});

readPool.on("connect", () => {
  console.log("📖 PostgreSQL SLAVE connected");
});

writePool.on("error", (err) => {
  console.error("❌ MASTER pool error:", err.message);
});

readPool.on("error", (err) => {
  console.error("❌ SLAVE pool error:", err.message);
});

module.exports = { writePool, readPool };
