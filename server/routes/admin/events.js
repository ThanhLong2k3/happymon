import express from "express";

export function createEventsRouter({ database, adminAuthMiddleware }) {
  const router = express.Router();

  router.get("/", adminAuthMiddleware, async (_request, response, next) => {
    try {
      const [events] = await database.query(
        "SELECT id, title, slug, summary, content, featured_image AS featuredImage, DATE_FORMAT(event_date, '%Y-%m-%d %H:%i:%s') AS eventDate, location, CASE WHEN event_date IS NULL THEN status WHEN DATE(event_date) > DATE(DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR)) THEN 'upcoming' WHEN DATE(event_date) = DATE(DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR)) THEN 'ongoing' ELSE 'completed' END AS status FROM events ORDER BY event_date DESC, id DESC"
      );
      response.json(events);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", adminAuthMiddleware, async (request, response, next) => {
    const { title, slug, summary, content, featuredImage, eventDate, location } = request.body || {};
    if (!title || !slug || !eventDate || !location) {
      response.status(400).json({ error: "Vui lòng nhập tên, slug, thời gian và địa điểm sự kiện." });
      return;
    }
    try {
      const [result] = await database.execute(
        "INSERT INTO events (title, slug, summary, content, featured_image, event_date, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')",
        [title, slug, summary || "", content || "", featuredImage || null, eventDate, location]
      );
      await database.execute(
        "UPDATE content_items SET title = ?, published_at = ?, excerpt = ?, body = ?, featured_image = ? WHERE type = 'event' AND slug = ?",
        [title, eventDate, summary || "", content || summary || "", featuredImage || null, slug]
      );
      response.status(201).json({ id: result.insertId, message: "Đã tạo sự kiện." });
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    const { title, slug, summary, content, featuredImage, eventDate, location } = request.body || {};
    if (!title || !slug || !eventDate || !location) {
      response.status(400).json({ error: "Vui lòng nhập tên, slug, thời gian và địa điểm sự kiện." });
      return;
    }
    try {
      const [[existingEvent]] = await database.execute(
        "SELECT slug FROM events WHERE id = ? LIMIT 1",
        [id]
      );
      await database.execute(
        "UPDATE events SET title = ?, slug = ?, summary = ?, content = ?, featured_image = ?, event_date = ?, location = ? WHERE id = ?",
        [title, slug, summary || "", content || "", featuredImage || null, eventDate, location, id]
      );
      if (existingEvent) {
        await database.execute(
          "UPDATE content_items SET slug = ?, title = ?, published_at = ?, excerpt = ?, body = ?, featured_image = ? WHERE type = 'event' AND slug = ?",
          [slug, title, eventDate, summary || "", content || summary || "", featuredImage || null, existingEvent.slug]
        );
      }
      response.json({ message: "Đã cập nhật sự kiện." });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", adminAuthMiddleware, async (request, response, next) => {
    try {
      const [[event]] = await database.execute(
        "SELECT slug FROM events WHERE id = ? LIMIT 1",
        [request.params.id]
      );
      await database.execute("DELETE FROM events WHERE id = ?", [request.params.id]);
      if (event) {
        await database.execute(
          "DELETE FROM content_items WHERE type = 'event' AND slug = ?",
          [event.slug]
        );
      }
      response.json({ message: "Đã xóa sự kiện." });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
