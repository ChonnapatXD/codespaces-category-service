const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const { readPool, writePool } = require("./db");
const redis = require("./redisClient");

const app = express();
const port = 6002;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});



app.get("/api/categories/:type", async (req, res) => {
  const { type } = req.params;

  if (!["main", "snack", "drink"].includes(type)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    console.log(`🔥 GET category: ${type}`);

    // 1. Redis
    const cache = await redis.get(`menu:${type}`);
    if (cache) {
      console.log(`📦 Redis HIT: ${type}`);
      return res.json(JSON.parse(cache));
    }

    console.log(`📝 Redis MISS → Query DB (SLAVE)`);

    // 2. Read from SLAVE
    const result = await readPool.query(
      "SELECT id, name, price, image FROM menus WHERE category = $1 ORDER BY id",
      [type]
    );
    console.log("DB RESULT:", result.rows);

    // 3. Cache
    await redis.set(
      `menu:${type}`,
      JSON.stringify(result.rows),
      "EX",
      60
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ API error:", err);
    res.status(500).json({ message: "Database error" });
  }
});



app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "category" });
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await writePool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


app.listen(port, () => {
  console.log(`Category service running on port ${port}`);
});

app.get("/api/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await readPool.query(
      "SELECT id, name, price, image, category FROM menus WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: "Database error" });
  }
});
