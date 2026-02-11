import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL or POSTGRES_URL must be set");
}

const pool = new Pool({
    connectionString,
    // Add SSL for production/Vercel environments if needed, 
    // but usually the connection string params handle it or Vercel environment implies it.
    // For Prisma/Neon/Vercel Postgres via URL, 'sslmode=require' in string is key.
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
