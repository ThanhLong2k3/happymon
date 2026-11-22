import express from "express";

export function createProgramsRouter({ database, adminAuthMiddleware }) {
  const router = express.Router();

  // 7. Quản lý Chương trình học & CLB (Programs CRUD)
  router.get("/", adminAuthMiddleware, async (_request, response, next) => {
    try {
      const [rows] = await database.query(
        "SELECT id, title, slug, category, age_group AS ageGroup, short_description AS shortDescription, description, featured_image AS featuredImage, display_order AS displayOrder FROM programs ORDER BY display_order ASC, id ASC"
      );
      response.json(rows);
    } catch (error) {
      next(error);
    }
  });
  
  router.post("/", adminAuthMiddleware, async (request, response, next) => {
    const { title, slug, category, ageGroup, shortDescription, description, featuredImage, displayOrder } = request.body || {};
    if (!title || !slug) {
      response.status(400).json({ error: "Tiêu đề và slug không được để trống." });
      return;
    }
    try {
      const [result] = await database.execute(
        "INSERT INTO programs (title, slug, category, age_group, short_description, description, featured_image, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)",
        [title, slug, category || "club", ageGroup || "18 tháng - 6 tuổi", shortDescription || "", description || "", featuredImage || null, displayOrder || 0]
      );
      response.status(201).json({ id: result.insertId, message: "Thêm chương trình thành công." });
    } catch (error) {
      next(error);
    }
  });
  
  router.put("/:id", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    const { title, slug, category, ageGroup, shortDescription, description, featuredImage, displayOrder } = request.body || {};
    try {
      await database.execute(
        "UPDATE programs SET title = ?, slug = ?, category = ?, age_group = ?, short_description = ?, description = ?, featured_image = ?, display_order = ? WHERE id = ?",
        [title, slug, category || "club", ageGroup || "18 tháng - 6 tuổi", shortDescription || "", description || "", featuredImage || null, displayOrder || 0, id]
      );
      response.json({ message: "Cập nhật chương trình thành công." });
    } catch (error) {
      next(error);
    }
  });
  
  router.delete("/:id", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    try {
      await database.execute("DELETE FROM programs WHERE id = ?", [id]);
      response.json({ message: "Đã xóa chương trình." });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
