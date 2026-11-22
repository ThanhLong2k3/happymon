import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabasePool } from "../server/db.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(root, "src", "data", "content.json");

if (existsSync(path.join(root, ".env"))) {
  process.loadEnvFile(path.join(root, ".env"));
}

if (!existsSync(contentPath)) {
  throw new Error(
    "Missing src/data/content.json. Run scripts/import-wordpress-backup.py first.",
  );
}

const content = JSON.parse(readFileSync(contentPath, "utf8"));
if (
  !Array.isArray(content) ||
  content.some((item) => !item.slug || !item.type || !item.title)
) {
  throw new Error("The public content export is invalid.");
}

const database = createDatabasePool();

try {
  await database.query(`
    CREATE TABLE IF NOT EXISTS content_items (
      id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
      type VARCHAR(40) NOT NULL,
      slug VARCHAR(200) NOT NULL,
      title VARCHAR(500) NOT NULL,
      published_at DATETIME NULL,
      excerpt TEXT NOT NULL,
      body LONGTEXT NOT NULL,
      featured_image VARCHAR(500) NULL,
      UNIQUE KEY uq_content_type_slug (type, slug),
      KEY idx_content_type_date (type, published_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const insert = `
    INSERT INTO content_items
      (id, type, slug, title, published_at, excerpt, body, featured_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      type = VALUES(type),
      slug = VALUES(slug),
      title = VALUES(title),
      published_at = VALUES(published_at),
      excerpt = VALUES(excerpt),
      body = VALUES(body),
      featured_image = VALUES(featured_image)
  `;

  const connection = await database.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of content) {
      const publishedAt =
        typeof item.date === "string" &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(item.date)
          ? item.date
          : null;
      await connection.execute(insert, [
        item.id,
        item.type,
        item.slug,
        item.title,
        publishedAt,
        item.excerpt || "",
        item.body || "",
        item.featuredImage || null,
      ]);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  console.log(`Imported ${content.length} published content items into MySQL.`);
} finally {
  await database.end();
}
