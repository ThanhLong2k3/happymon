import mysql from "mysql2/promise";

export function createDatabasePool() {
  const required = ["DB_NAME", "DB_USER", "DB_PASSWORD"];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(
      `Missing database settings: ${missing.join(", ")}. Configure them in .env before starting the server.`,
    );
  }

  const port = Number.parseInt(process.env.DB_PORT || "3306", 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("DB_PORT must be a valid TCP port.");
  }

  return mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    connectionLimit: 10,
    enableKeepAlive: true,
    waitForConnections: true,
  });
}

export async function verifyDatabase(pool) {
  await pool.query("SELECT 1");
  const [tables] = await pool.execute(
    "SELECT COUNT(*) AS found FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name IN ('teachers', 'programs', 'testimonials', 'events', 'posts', 'content_items')",
  );
  if (tables[0].found === 0) {
    throw new Error(
      "The MySQL connection works, but database tables are missing. Run npm run db:import.",
    );
  }
}
