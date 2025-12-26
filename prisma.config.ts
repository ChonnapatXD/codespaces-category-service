import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  client: {
    output: "../generated/prisma",
  },
  datasource: {
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL, // ใช้ตัวแปรจาก .env
    },
  },
});
