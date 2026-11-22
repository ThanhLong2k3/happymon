import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import path from "node:path";
import express from "express";

export function createSubmissionsRouter({ database, root, adminAuthMiddleware }) {
  const router = express.Router();

  // 5. Quản lý Đơn đăng ký tư vấn / tuyển sinh (Contact Submissions)
  router.get("/", adminAuthMiddleware, async (_request, response, next) => {
    try {
      const [rows] = await database.query(
        "SELECT id, name, phone, email, message, status, notes, submission_type AS submissionType, parent_address AS parentAddress, child_name AS childName, child_age AS childAge, child_age_months AS childAgeMonths, DATE_FORMAT(enrollment_date, '%Y-%m-%d') AS enrollmentDate, payment_status AS paymentStatus, payment_image_filename IS NOT NULL AS hasPaymentProof, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS createdAt FROM contact_submissions ORDER BY id DESC"
      );
      response.json(rows);
    } catch (error) {
      next(error);
    }
  });
  
  router.get(
    "/:id/payment-proof",
    adminAuthMiddleware,
    async (request, response, next) => {
      try {
        const [rows] = await database.execute(
          "SELECT payment_image_filename AS fileName FROM contact_submissions WHERE id = ? AND submission_type = 'enrollment' LIMIT 1",
          [request.params.id],
        );
        const fileName = rows[0]?.fileName;
        if (!fileName || !/^[a-f0-9-]+\.(jpg|png|gif|webp)$/i.test(fileName)) {
          response.status(404).json({ error: "Không tìm thấy ảnh biên nhận." });
          return;
        }
  
        const filePath = path.join(
          root,
          "storage",
          "registration-payments",
          fileName,
        );
        if (!existsSync(filePath)) {
          response.status(404).json({ error: "Ảnh biên nhận không còn tồn tại." });
          return;
        }
  
        response.set("Cache-Control", "private, no-store");
        response.sendFile(filePath);
      } catch (error) {
        next(error);
      }
    },
  );
  
  router.put("/:id/status", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    const { status, notes } = request.body || {};
    const allowedStatuses = new Set(["new", "contacted", "scheduled", "enrolled", "cancelled"]);
    if (status !== undefined && !allowedStatuses.has(status)) {
      response.status(400).json({ error: "Trạng thái đăng ký không hợp lệ." });
      return;
    }
    if (
      notes !== undefined &&
      notes !== null &&
      (typeof notes !== "string" || notes.length > 2000)
    ) {
      response.status(400).json({ error: "Ghi chú không được vượt quá 2.000 ký tự." });
      return;
    }
    try {
      const [existing] = await database.execute(
        "SELECT id FROM contact_submissions WHERE id = ? LIMIT 1",
        [id],
      );
      if (!existing.length) {
        response.status(404).json({ error: "Không tìm thấy đơn đăng ký." });
        return;
      }
  
      await database.execute(
        "UPDATE contact_submissions SET status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?",
        [status || null, notes !== undefined ? notes : null, id]
      );
      response.json({ message: "Cập nhật trạng thái thành công." });
    } catch (error) {
      next(error);
    }
  });
  
  router.delete("/:id", adminAuthMiddleware, async (request, response, next) => {
    const { id } = request.params;
    try {
      const [rows] = await database.execute(
        "SELECT payment_image_filename AS fileName FROM contact_submissions WHERE id = ? LIMIT 1",
        [id],
      );
      await database.execute("DELETE FROM contact_submissions WHERE id = ?", [id]);
      if (rows[0]?.fileName) {
        const filePath = path.join(
          root,
          "storage",
          "registration-payments",
          rows[0].fileName,
        );
        try {
          await unlink(filePath);
        } catch (error) {
          if (error.code !== "ENOENT") {
            console.error("Could not remove deleted registration payment proof:", error.message);
          }
        }
      }
      response.json({ message: "Đã xóa đơn đăng ký." });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
