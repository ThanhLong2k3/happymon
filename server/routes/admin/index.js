import crypto from "node:crypto";
import path from "node:path";
import express from "express";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { getImageFormat } from "../../utils/imageFormat.js";
import { createDashboardRouter } from "./dashboard.js";
import { createPostsRouter } from "./posts.js";
import { createProductsRouter } from "./products.js";
import { createProgramsRouter } from "./programs.js";
import { createSubmissionsRouter } from "./submissions.js";
import { createTeachersRouter } from "./teachers.js";
import { createTestimonialsRouter } from "./testimonials.js";
import { createPromotionsRouter } from "./promotions.js";
import { createEventsRouter } from "./events.js";
import { createManagedPagesRouter } from "./pages.js";

export function createAdminRouter({ database, root }) {
  const router = express.Router();

  /* ========================================================
     ADMIN API ROUTES (Quản lý hệ thống)
     ======================================================== */
  
  // Quản lý sessions có lưu trữ để không bị mất khi máy chủ khởi động lại
  const sessionsFile = path.join(root, "storage", "admin-sessions.json");
  const adminSessions = new Map();

  try {
    if (existsSync(sessionsFile)) {
      const parsed = JSON.parse(readFileSync(sessionsFile, "utf8"));
      const now = Date.now();
      for (const [t, s] of Object.entries(parsed)) {
        if (s && s.expiresAt > now) {
          adminSessions.set(t, s);
        }
      }
    }
  } catch (err) {
    console.error("Could not load admin sessions:", err.message);
  }

  function persistSessions() {
    try {
      const obj = Object.fromEntries(adminSessions.entries());
      writeFileSync(sessionsFile, JSON.stringify(obj), "utf8");
    } catch (err) {
      console.error("Could not persist admin sessions:", err.message);
    }
  }

  function hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  function adminAuthMiddleware(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(401).json({ error: "Yêu cầu đăng nhập quản trị viên." });
      return;
    }
    const token = authHeader.substring(7);
    const session = adminSessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
      if (session) {
        adminSessions.delete(token);
        persistSessions();
      }
      response.status(401).json({ error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
      return;
    }
    request.admin = session.admin;
    next();
  }
  
  

  // 1. Đăng nhập Admin
  router.post("/login", async (request, response) => {
    const { username, password } = request.body || {};
    if (!username || !password) {
      response.status(400).json({ error: "Vui lòng nhập tên đăng nhập và mật khẩu." });
      return;
    }
  
    try {
      const passwordHash = hashPassword(password);
      const [rows] = await database.execute(
        "SELECT id, username, full_name AS fullName, email, role FROM admins WHERE username = ? AND password_hash = ? LIMIT 1",
        [username, passwordHash]
      );
  
      if (rows.length === 0) {
        response.status(401).json({ error: "Tên đăng nhập hoặc mật khẩu không chính xác." });
        return;
      }
  
      const admin = rows[0];
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      adminSessions.set(token, {
        admin,
        expiresAt,
      });
      persistSessions();

      await database.execute("UPDATE admins SET last_login = NOW() WHERE id = ?", [admin.id]);
  
      response.json({
        token,
        expiresAt,
        admin: {
          id: admin.id,
          username: admin.username,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      console.error("Admin login error:", err.message);
      response.status(500).json({ error: "Lỗi hệ thống khi đăng nhập." });
    }
  });
  
  // 2. Kiểm tra phiên đăng nhập
  router.get("/me", adminAuthMiddleware, (request, response) => {
    response.json({ admin: request.admin });
  });
  
  // 3. Đăng xuất Admin
  router.post("/logout", adminAuthMiddleware, (request, response) => {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      adminSessions.delete(authHeader.substring(7));
      persistSessions();
    }
    response.json({ message: "Đã đăng xuất thành công." });
  });
  
  router.post(
    "/upload",
    adminAuthMiddleware,
    express.raw({ type: "*/*", limit: "5mb" }),
    async (request, response, next) => {
      const image = request.body;
      if (!Buffer.isBuffer(image) || image.length === 0) {
        response.status(400).json({ error: "Vui lòng chọn tệp ảnh hợp lệ." });
        return;
      }
  
      const format = getImageFormat(image);
      if (!format) {
        response.status(415).json({ error: "Tệp tải lên không phải ảnh được hỗ trợ." });
        return;
      }
  
      try {
        const uploadDirectory = path.join(root, "public", "media", "uploads");
        const fileName = `${crypto.randomUUID()}.${format.extension}`;
        await mkdir(uploadDirectory, { recursive: true });
        await writeFile(path.join(uploadDirectory, fileName), image, { flag: "wx" });
        response.status(201).json({
          url: `/media/uploads/${fileName}`,
          contentType: format.contentType,
        });
      } catch (error) {
        next(error);
      }
    },
  );
  
  

  router.use("/stats", createDashboardRouter({ database, adminAuthMiddleware }));
  router.use("/submissions", createSubmissionsRouter({ database, root, adminAuthMiddleware }));
  router.use("/teachers", createTeachersRouter({ database, adminAuthMiddleware }));
  router.use("/programs", createProgramsRouter({ database, adminAuthMiddleware }));
  router.use("/posts", createPostsRouter({ database, adminAuthMiddleware }));
  router.use("/testimonials", createTestimonialsRouter({ database, adminAuthMiddleware }));
  router.use("/products", createProductsRouter({ database, adminAuthMiddleware }));
  router.use("/promotions", createPromotionsRouter({ database, adminAuthMiddleware }));
  router.use("/events", createEventsRouter({ database, adminAuthMiddleware }));
  router.use("/pages", createManagedPagesRouter({ database, adminAuthMiddleware }));

  return router;
}
