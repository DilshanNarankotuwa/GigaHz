import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || "gigahz",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Optional connection test
pool.connect()
  .then(client => {
    console.log("✅ PostgreSQL connected");
    client.release();
  })
  .catch(err => {
    console.error("❌ DB connection error:", err.message);
  });
