const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,        // ต้องเป็น 'redis' ถ้าอยู่ใน Docker network
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME, // ต้องใส่ myuser
  password: process.env.REDIS_PASSWORD, // ต้องใส่ mypassword
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
