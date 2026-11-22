import express from "express";

export function createTeachersRouter({ database, adminAuthMiddleware }) {
  const router = express.Router();

  // 6. Quản lý Đội ngũ Giáo viên (Teachers CRUD)
  router.get("/", adminAuthMiddleware, async (_request, response, next) => {
    try {
      const [rows] = await database.query(
        "SELECT id, name, slug, role_title AS roleTitle, class_name AS className, bio, avatar_url AS avatarUrl, display_order AS displayOrder, is_active AS isActive FROM teachers ORDER BY display_order ASC, id ASC"
      );
      response.json(rows);
    } catch (error) {
      next(error);
    }
  });
  
  router.post("/", adminAuthMiddleware, async (request, response, next) => {
    const { name, slug, roleTitle, className, bio, avatarUrl, displayOrder } = request.body || {};
    if (!name || !slug) {
      response.status(400).json({ error: "Họ tên và slug không được để trống." });
      return;
    }
    try {
      const [result] = await database.execute(
        "INSERT INTO teachers (name, slug, role_title, class_name, bio, avatar_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)",
        [name, slug, roleTitle || "", className || "", bio || "", avatarUrl || null, displayOrder || 0]
      );
      response.status(201).json({ id: result.insertId, message: "Thêm giáo viên thành công." });
    } catch (error) {
      next(error);
    }
  });
  
  router.put("/:id", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    const { name, slug, roleTitle, className, bio, avatarUrl, displayOrder, isActive } = request.body || {};
    try {
      await database.execute(
        "UPDATE teachers SET name = ?, slug = ?, role_title = ?, class_name = ?, bio = ?, avatar_url = ?, display_order = ?, is_active = ? WHERE id = ?",
        [name, slug, roleTitle || "", className || "", bio || "", avatarUrl || null, displayOrder || 0, isActive !== undefined ? isActive : 1, id]
      );
      response.json({ message: "Cập nhật thông tin giáo viên thành công." });
    } catch (error) {
      next(error);
    }
  });
  
  router.delete("/:id", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    try {
      await database.execute("DELETE FROM teachers WHERE id = ?", [id]);
      response.json({ message: "Đã xóa giáo viên." });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
