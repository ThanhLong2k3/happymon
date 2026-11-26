import express from "express";

const managedPages = {
  aboutPage: "gioi-thieu-ve-mam-non-happy-montessori",
  enrollmentPage: "thong-bao-tuyen-sinh",
};

export function createManagedPagesRouter({ database, adminAuthMiddleware }) {
  const router = express.Router();

  router.get("/:pageKey", adminAuthMiddleware, async (request, response, next) => {
    const slug = managedPages[request.params.pageKey];
    if (!slug) {
      response.status(404).json({ error: "Không tìm thấy trang cần quản lý." });
      return;
    }
    try {
      const [rows] = await database.execute(
        "SELECT id, type, slug, title, excerpt, body, featured_image AS featuredImage FROM content_items WHERE type = 'page' AND slug = ? LIMIT 1",
        [slug]
      );
      if (!rows.length) {
        response.status(404).json({ error: "Chưa tìm thấy dữ liệu trang trong content_items." });
        return;
      }
      response.json({ ...rows[0], pageKey: request.params.pageKey });
    } catch (error) {
      next(error);
    }
  });

  router.put("/:pageKey", adminAuthMiddleware, async (request, response, next) => {
    const slug = managedPages[request.params.pageKey];
    if (!slug) {
      response.status(404).json({ error: "Không tìm thấy trang cần quản lý." });
      return;
    }
    const { title, excerpt, body, featuredImage } = request.body || {};
    if (!title || !body) {
      response.status(400).json({ error: "Tiêu đề và nội dung chi tiết không được để trống." });
      return;
    }
    try {
      const [result] = await database.execute(
        "UPDATE content_items SET title = ?, excerpt = ?, body = ?, featured_image = ? WHERE type = 'page' AND slug = ?",
        [title, excerpt || "", body, featuredImage || null, slug]
      );
      if (!result.affectedRows) {
        response.status(404).json({ error: "Chưa tìm thấy dữ liệu trang để cập nhật." });
        return;
      }
      response.json({ message: "Đã cập nhật nội dung trang." });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
