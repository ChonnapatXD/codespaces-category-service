const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const pool = require("./db");
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

  // ป้องกัน category แปลก ๆ
  if (!["main", "snack", "drink"].includes(type)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    console.log(`🔥 GET category: ${type}`);

    // 1. เช็ค Redis
    const cache = await redis.get(`menu:${type}`);
    if (cache) {
      console.log(`📦 Redis HIT: ${type}`);
      return res.json(JSON.parse(cache));
    }

    console.log(`📝 Redis MISS → Query DB`);

    // 2. Query DB
    const result = await pool.query(
      "SELECT id, name, price, image FROM menus WHERE category = $1 ORDER BY id",
      [type]
    );

    // 3. เก็บ cache
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
    const result = await db.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Category service running on port ${port}`);
});

app.get('/api/menumain/:id', (req, res) => {
  const itemId = parseInt(req.params.id)
  const item = menumain.find(item => item.id === itemId)
  if (item) {
    res.json(item)
  } else {
    res.status(404).json({message: 'Item not found'})
  }
})

app.get('/api/menusnack/:id', (req, res) => {
  const itemId = parseInt(req.params.id)
  const item = menusnack.find(item => item.id === itemId)
  if (item) {
    res.json(item)
  } else {
    res.status(404).json({message: 'Item not found'})
  }
})

app.get('/api/menudrink/:id', (req, res) => {
  const itemId = parseInt(req.params.id)
  const item = menudrink.find(item => item.id === itemId)
  if (item) {
    res.json(item)
  } else {
    res.status(404).json({message: 'Item not found'})
  }
})
