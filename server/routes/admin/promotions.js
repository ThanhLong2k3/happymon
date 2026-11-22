import express from "express";

export function createPromotionsRouter({ database, adminAuthMiddleware }) {
  const router = express.Router();

  // Đảm bảo bảng promotions tồn tại
  let tableEnsured = false;
  async function ensurePromotionsTable() {
    if (tableEnsured) return;
    await database.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        start_date DATETIME NULL,
        end_date DATETIME NOT NULL,
        is_active TINYINT(1) DEFAULT 1,
        tier1 VARCHAR(255) NULL,
        tier2 VARCHAR(255) NULL,
        tier3 VARCHAR(255) NULL,
        tier4 VARCHAR(255) NULL,
        tier5 VARCHAR(255) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY idx_promotion_active (is_active, end_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    tableEnsured = true;
  }

  // 1. Lấy danh sách promotions
  router.get("/", adminAuthMiddleware, async (_req, res, next) => {
    try {
      await ensurePromotionsTable();
      const [rows] = await database.query(`
        SELECT 
          id, 
          title, 
          DATE_FORMAT(start_date, '%Y-%m-%d %H:%i:%s') AS startDate, 
          DATE_FORMAT(end_date, '%Y-%m-%d %H:%i:%s') AS endDate, 
          is_active AS isActive, 
          tier1, 
          tier2, 
          tier3, 
          tier4, 
          tier5, 
          DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS createdAt 
        FROM promotions 
        ORDER BY is_active DESC, end_date DESC, id DESC
      `);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  // 2. Thêm promotion mới
  router.post("/", adminAuthMiddleware, async (req, res, next) => {
    const { title, startDate, endDate, isActive, tier1, tier2, tier3, tier4, tier5 } = req.body || {};
    if (!title || !endDate) {
      res.status(400).json({ error: "Vui lòng nhập tiêu đề và ngày kết thúc ưu đãi." });
      return;
    }

    try {
      await ensurePromotionsTable();
      const activeVal = isActive === false || isActive === 0 ? 0 : 1;
      const [result] = await database.execute(
        `INSERT INTO promotions (title, start_date, end_date, is_active, tier1, tier2, tier3, tier4, tier5) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title.trim(),
          startDate || null,
          endDate,
          activeVal,
          tier1?.trim() || null,
          tier2?.trim() || null,
          tier3?.trim() || null,
          tier4?.trim() || null,
          tier5?.trim() || null,
        ]
      );
      res.status(201).json({ id: result.insertId, message: "Đã thêm ưu đãi thành công." });
    } catch (err) {
      next(err);
    }
  });

  // 3. Cập nhật promotion
  router.put("/:id", adminAuthMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const { title, startDate, endDate, isActive, tier1, tier2, tier3, tier4, tier5 } = req.body || {};
    if (!title || !endDate) {
      res.status(400).json({ error: "Vui lòng nhập tiêu đề và ngày kết thúc ưu đãi." });
      return;
    }

    try {
      await ensurePromotionsTable();
      const activeVal = isActive === false || isActive === 0 ? 0 : 1;
      const [result] = await database.execute(
        `UPDATE promotions 
         SET title = ?, start_date = ?, end_date = ?, is_active = ?, tier1 = ?, tier2 = ?, tier3 = ?, tier4 = ?, tier5 = ? 
         WHERE id = ?`,
        [
          title.trim(),
          startDate || null,
          endDate,
          activeVal,
          tier1?.trim() || null,
          tier2?.trim() || null,
          tier3?.trim() || null,
          tier4?.trim() || null,
          tier5?.trim() || null,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Không tìm thấy chương trình ưu đãi." });
        return;
      }

      res.json({ message: "Đã cập nhật ưu đãi thành công." });
    } catch (err) {
      next(err);
    }
  });

  // 4. Xóa promotion
  router.delete("/:id", adminAuthMiddleware, async (req, res, next) => {
    const { id } = req.params;
    try {
      await ensurePromotionsTable();
      const [result] = await database.execute("DELETE FROM promotions WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Không tìm thấy chương trình ưu đãi." });
        return;
      }
      res.json({ message: "Đã xóa chương trình ưu đãi." });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
