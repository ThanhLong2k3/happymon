import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabasePool } from "../server/db.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (existsSync(path.join(root, ".env"))) {
  process.loadEnvFile(path.join(root, ".env"));
}

const database = createDatabasePool();
const columns = [
  ["submission_type", "ENUM('contact', 'enrollment') NOT NULL DEFAULT 'contact'"],
  ["parent_address", "VARCHAR(500) NULL"],
  ["child_age_months", "SMALLINT UNSIGNED NULL"],
  ["enrollment_date", "DATE NULL"],
  ["payment_status", "ENUM('unpaid', 'later', 'proof_submitted') NOT NULL DEFAULT 'unpaid'"],
  ["payment_image_filename", "VARCHAR(100) NULL"],
  ["registration_token_hash", "CHAR(64) NULL"],
];

try {
  const [tables] = await database.execute(
    "SELECT COUNT(*) AS found FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'contact_submissions'",
  );
  if (!tables[0].found) {
    throw new Error(
      "Missing contact_submissions table. Run npm run db:import first.",
    );
  }

  for (const [name, definition] of columns) {
    const [existing] = await database.execute(
      "SELECT COUNT(*) AS found FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'contact_submissions' AND column_name = ?",
      [name],
    );
    if (!existing[0].found) {
      await database.query(
        `ALTER TABLE contact_submissions ADD COLUMN ${name} ${definition}`,
      );
      console.log(`Added contact_submissions.${name}`);
    }
  }

  const [indexes] = await database.execute(
    "SELECT COUNT(*) AS found FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'contact_submissions' AND index_name = 'uq_registration_token_hash'",
  );
  if (!indexes[0].found) {
    await database.query(
      "ALTER TABLE contact_submissions ADD UNIQUE KEY uq_registration_token_hash (registration_token_hash)",
    );
  }

  const [typeIndexes] = await database.execute(
    "SELECT COUNT(*) AS found FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'contact_submissions' AND index_name = 'idx_contact_type_status'",
  );
  if (!typeIndexes[0].found) {
    await database.query(
      "ALTER TABLE contact_submissions ADD KEY idx_contact_type_status (submission_type, status)",
    );
  }

  console.log("Registration database migration complete.");
} finally {
  await database.end();
}
