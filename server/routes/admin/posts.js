import express from "express";

export function createPostsRouter({ database, adminAuthMiddleware }) {
  const router = express.Router();

  // 8. Quản lý Tin tức / Bài viết (Posts CRUD)
  router.get("/", adminAuthMiddleware, async (_request, response, next) => {
    try {
      const [rows] = await database.query(
        "SELECT id, title, slug, category, excerpt, body, featured_image AS featuredImage, DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') AS publishedAt FROM posts ORDER BY published_at DESC, id DESC"
      );
      response.json(rows);
    } catch (error) {
      next(error);
    }
  });
  
  router.post("/", adminAuthMiddleware, async (request, response, next) => {
    const { title, slug, category, excerpt, body, featuredImage } = request.body || {};
    if (!title || !slug) {
      response.status(400).json({ error: "Tiêu đề và đường dẫn (slug) không được để trống." });
      return;
    }
    try {
      const [result] = await database.execute(
        "INSERT INTO posts (title, slug, category, excerpt, body, featured_image, published_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [title, slug, category || "Góc chia sẻ", excerpt || "", body || "", featuredImage || null]
      );
      // Đồng thời cập nhật vào content_items để người dùng xem được ngay
      await database.execute(
        "INSERT INTO content_items (id, type, slug, title, published_at, excerpt, body, featured_image) VALUES (?, 'post', ?, ?, NOW(), ?, ?, ?)",
        [Date.now(), slug, title, excerpt || "", body || "", featuredImage || null]
      );
      response.status(201).json({ id: result.insertId, message: "Thêm bài viết mới thành công." });
    } catch (error) {
      next(error);
    }
  });
  
  router.put("/:id", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    const { title, slug, category, excerpt, body, featuredImage } = request.body || {};
    try {
      await database.execute(
        "UPDATE posts SET title = ?, slug = ?, category = ?, excerpt = ?, body = ?, featured_image = ? WHERE id = ?",
        [title, slug, category || "Góc chia sẻ", excerpt || "", body || "", featuredImage || null, id]
      );
      response.json({ message: "Cập nhật bài viết thành công." });
    } catch (error) {
      next(error);
    }
  });
  
  router.delete("/:id", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    try {
      await database.execute("DELETE FROM posts WHERE id = ?", [id]);
      response.json({ message: "Đã xóa bài viết." });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
