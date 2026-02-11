import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { sql } from "@vercel/postgres";
import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Determine if we are in a Vercel environment or have Vercel Postgres configured
const isVercel = !!process.env.POSTGRES_URL;

let db: any;

if (isVercel) {
    // Use Vercel Postgres SDK (optimized for serverless)
    db = drizzleVercel(sql, { schema });
} else {
    // Use standard Postgres driver for local development
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    db = drizzlePg(pool, { schema });
}

export { db };

// Export for type inference (might need adjustment depending on your exact type needs)
export type Database = typeof db;
