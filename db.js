const { Pool } = require("pg");

// WRITE → MASTER
const writePool = new Pool({
  connectionString: process.env.DATABASE_WRITE_URL,
});

// READ → SLAVE
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
  console.error("❌ MASTER error:", err);
});

readPool.on("error", (err) => {
  console.error("❌ SLAVE error:", err);
});

module.exports = {
  writePool,
  readPool,
};
