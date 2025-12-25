const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,   // ต้องเป็น 127.0.0.1
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  connectTimeout: 5000,
  maxRetriesPerRequest: 1,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("ready", () => {
  console.log("🚀 Redis ready");
});

redis.on("error", (err) => {
  console.error("❌ Redis error FULL:", err);
});

module.exports = redis;
