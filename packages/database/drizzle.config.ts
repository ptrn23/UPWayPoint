import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // Changed from 'driver: pg'
  dbCredentials: {
    url: process.env.DATABASE_URL || "", // Changed from 'connectionString'
  },
} satisfies Config;