import express from "express";

export function createTestimonialsRouter({ database, adminAuthMiddleware }) {
  const router = express.Router();

  // 9. Quản lý Cảm nhận phụ huynh (Testimonials CRUD)
  router.get("/", adminAuthMiddleware, async (_request, response, next) => {
    try {
      const [rows] = await database.query(
        "SELECT id, parent_name AS parentName, slug, child_name AS childName, relationship, avatar_url AS avatarUrl, content, rating, display_order AS displayOrder FROM testimonials ORDER BY display_order ASC, id ASC"
      );
      response.json(rows);
    } catch (error) {
      next(error);
    }
  });
  
  router.post("/", adminAuthMiddleware, async (request, response, next) => {
    const { parentName, slug, childName, relationship, avatarUrl, content, rating, displayOrder } = request.body || {};
    if (!parentName || !content) {
      response.status(400).json({ error: "Tên phụ huynh và nội dung nhận xét không được để trống." });
      return;
    }
    try {
      const [result] = await database.execute(
        "INSERT INTO testimonials (parent_name, slug, child_name, relationship, avatar_url, content, rating, display_order, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)",
        [parentName, slug || `cam-nhan-${Date.now()}`, childName || "", relationship || "Phụ huynh", avatarUrl || null, content, rating || 5, displayOrder || 0]
      );
      response.status(201).json({ id: result.insertId, message: "Thêm cảm nhận phụ huynh thành công." });
    } catch (error) {
      next(error);
    }
  });
  
  router.put("/:id", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    const { parentName, slug, childName, relationship, avatarUrl, content, rating, displayOrder } = request.body || {};
    try {
      await database.execute(
        "UPDATE testimonials SET parent_name = ?, slug = ?, child_name = ?, relationship = ?, avatar_url = ?, content = ?, rating = ?, display_order = ? WHERE id = ?",
        [parentName, slug, childName || "", relationship || "Phụ huynh", avatarUrl || null, content, rating || 5, displayOrder || 0, id]
      );
      response.json({ message: "Cập nhật cảm nhận thành công." });
    } catch (error) {
      next(error);
    }
  });
  
  router.delete("/:id", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    try {
      await database.execute("DELETE FROM testimonials WHERE id = ?", [id]);
      response.json({ message: "Đã xóa cảm nhận." });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
