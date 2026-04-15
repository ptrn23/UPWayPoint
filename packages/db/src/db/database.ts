import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set!");
}

const connectionString = process.env.DATABASE_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = neon(connectionString);
export const db = drizzle(client, { schema });
export type Database = typeof db;
