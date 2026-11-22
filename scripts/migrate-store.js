import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabasePool } from "../server/db.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (existsSync(path.join(root, ".env"))) {
  process.loadEnvFile(path.join(root, ".env"));
}

const database = createDatabasePool();

try {
  const [tables] = await database.execute(
    "SELECT COUNT(*) AS found FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'products'",
  );
  if (!tables[0].found) {
    throw new Error("Missing products table. Run npm run db:import first.");
  }

  const [columns] = await database.execute(
    "SELECT COUNT(*) AS found FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'products' AND column_name = 'sizes'",
  );
  if (!columns[0].found) {
    await database.query(
      "ALTER TABLE products ADD COLUMN sizes VARCHAR(255) NOT NULL DEFAULT '' AFTER image_url",
    );
    console.log("Added products.sizes");
  }

  console.log("Store database migration complete.");
} finally {
  await database.end();
}
