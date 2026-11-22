import crypto from "node:crypto";
import path from "node:path";
import { createDatabasePool } from "../server/db.js";

process.loadEnvFile(path.resolve(".env"));

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const database = createDatabasePool();

try {
  await database.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NULL,
      role ENUM('admin', 'editor') DEFAULT 'admin',
      last_login DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const passwordHash = hashPassword("admin123");
  await database.execute(
    `INSERT INTO admins (username, password_hash, full_name, email, role)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       full_name = VALUES(full_name)`,
    [
      "admin",
      passwordHash,
      "Quản trị viên Happy Montessori",
      "admin@happymon.edu.vn",
      "admin",
    ],
  );

  console.log("Tạo bảng admins và tài khoản admin mặc định thành công!");
  console.log("Username: admin | Password: admin123");
} finally {
  await database.end();
}
