import { existsSync } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import express from "express";
import nodemailer from "nodemailer";
import { createDatabasePool, verifyDatabase } from "./db.js";
import { createAdminRouter } from "./routes/admin/index.js";
import { getImageFormat } from "./utils/imageFormat.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const distPath = path.join(root, "dist");

if (existsSync(path.join(root, ".env"))) {
  process.loadEnvFile(path.join(root, ".env"));
}

const app = express();
const database = createDatabasePool();

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

app.get("/api/health", async (_request, response, next) => {
  try {
    await database.query("SELECT 1");
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

// Endpoint chuẩn hóa: Danh sách giáo viên (Teachers)
app.get("/api/teachers", async (_request, response, next) => {
  try {
    const [teachers] = await database.query(
      "SELECT id, name, slug, role_title AS roleTitle, class_name AS className, bio, avatar_url AS avatarUrl, display_order AS displayOrder FROM teachers WHERE is_active = 1 ORDER BY display_order ASC, id ASC"
    );
    response.json(teachers);
  } catch (error) {
    next(error);
  }
});

// Endpoint chuẩn hóa: Chương trình học & Câu lạc bộ (Programs & Clubs)
app.get("/api/programs", async (request, response, next) => {
  const { category } = request.query;
  try {
    const query = category
      ? "SELECT id, title, slug, category, age_group AS ageGroup, short_description AS shortDescription, description, featured_image AS featuredImage, display_order AS displayOrder FROM programs WHERE is_active = 1 AND category = ? ORDER BY display_order ASC, id ASC"
      : "SELECT id, title, slug, category, age_group AS ageGroup, short_description AS shortDescription, description, featured_image AS featuredImage, display_order AS displayOrder FROM programs WHERE is_active = 1 ORDER BY display_order ASC, id ASC";
    const [programs] = category
      ? await database.execute(query, [category])
      : await database.query(query);
    response.json(programs);
  } catch (error) {
    next(error);
  }
});

// Endpoint chuẩn hóa: Cảm nhận của phụ huynh (Testimonials)
app.get("/api/testimonials", async (_request, response, next) => {
  try {
    const [testimonials] = await database.query(
      "SELECT id, parent_name AS parentName, slug, child_name AS childName, relationship, avatar_url AS avatarUrl, content, rating, display_order AS displayOrder FROM testimonials WHERE is_featured = 1 ORDER BY display_order ASC, id ASC"
    );
    response.json(testimonials);
  } catch (error) {
    next(error);
  }
});

// Endpoint chuẩn hóa: Hoạt động / Sự kiện (Events)
app.get("/api/events", async (_request, response, next) => {
  try {
    const [events] = await database.query(
      "SELECT id, title, slug, summary, content, featured_image AS featuredImage, DATE_FORMAT(event_date, '%Y-%m-%d %H:%i:%s') AS eventDate, location, CASE WHEN event_date IS NULL THEN status WHEN DATE(event_date) > DATE(DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR)) THEN 'upcoming' WHEN DATE(event_date) = DATE(DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR)) THEN 'ongoing' ELSE 'completed' END AS status FROM events ORDER BY event_date DESC, id DESC"
    );
    response.json(events);
  } catch (error) {
    next(error);
  }
});

// Endpoint chuẩn hóa: Bài viết tin tức & chia sẻ (Posts)
app.get("/api/posts", async (request, response, next) => {
  const parsedLimit = Number.parseInt(request.query.limit, 10);
  const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(parsedLimit, 100)) : 100;
  const { category } = request.query;
  try {
    const query = category
      ? "SELECT id, title, slug, category, excerpt, body, featured_image AS featuredImage, DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') AS publishedAt, is_featured AS isFeatured FROM posts WHERE category = ? ORDER BY published_at DESC, id DESC LIMIT ?"
      : "SELECT id, title, slug, category, excerpt, body, featured_image AS featuredImage, DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') AS publishedAt, is_featured AS isFeatured FROM posts ORDER BY published_at DESC, id DESC LIMIT ?";
    const [posts] = category
      ? await database.execute(query, [category, limit])
      : await database.execute(query, [limit]);
    response.json(posts);
  } catch (error) {
    next(error);
  }
});

app.get("/api/products", async (_request, response, next) => {
  try {
    const [products] = await database.query(
      "SELECT id, name, slug, category, price, description, image_url AS imageUrl, sizes, in_stock AS inStock FROM products ORDER BY category ASC, name ASC, id ASC",
    );
    response.json(products);
  } catch (error) {
    next(error);
  }
});

// Endpoint: Chiến dịch ưu đãi tuyển sinh hiển thị trang chủ (Promotion / Countdown)
app.get("/api/promotion/homepage", async (_request, response) => {
  try {
    const [promotions] = await database.query(
      `SELECT 
        id, 
        title, 
        DATE_FORMAT(start_date, '%Y-%m-%d %H:%i:%s') AS startDate, 
        DATE_FORMAT(end_date, '%Y-%m-%d %H:%i:%s') AS endDate, 
        is_active AS isActive, 
        tier1, 
        tier2, 
        tier3, 
        tier4, 
        tier5 
      FROM promotions 
      WHERE is_active = 1 AND end_date > NOW() 
      ORDER BY end_date ASC 
      LIMIT 1`
    );
    response.json({
      data: promotions,
      promotion: promotions[0] || null,
    });
  } catch (error) {
    response.json({ data: [], promotion: null });
  }
});

// Endpoint chuẩn hóa: Chi tiết theo slug (hỗ trợ tìm kiếm thông minh qua các bảng chuẩn hóa)
app.get("/api/item/:type/:slug", async (request, response, next) => {
  const { type, slug } = request.params;
  try {
    let result = null;
    if (type === "teacher" || type === "team") {
      const [rows] = await database.execute(
        "SELECT id, name AS title, slug, role_title AS roleTitle, class_name AS className, bio AS body, avatar_url AS featuredImage FROM teachers WHERE slug = ? LIMIT 1",
        [slug]
      );
      result = rows[0];
    } else if (type === "program" || type === "course") {
      const [rows] = await database.execute(
        "SELECT id, title, slug, category, age_group AS ageGroup, short_description AS excerpt, description AS body, featured_image AS featuredImage FROM programs WHERE slug = ? LIMIT 1",
        [slug]
      );
      result = rows[0];
    } else if (type === "event") {
      const [rows] = await database.execute(
        "SELECT id, title, slug, summary AS excerpt, content AS body, featured_image AS featuredImage, DATE_FORMAT(event_date, '%Y-%m-%d %H:%i:%s') AS date, location FROM events WHERE slug = ? LIMIT 1",
        [slug]
      );
      result = rows[0];
    } else if (type === "post") {
      const [rows] = await database.execute(
        "SELECT id, title, slug, category, excerpt, body, featured_image AS featuredImage, DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') AS date FROM posts WHERE slug = ? LIMIT 1",
        [slug]
      );
      result = rows[0];
    }
    if (!result) {
      response.status(404).json({ error: "Không tìm thấy nội dung." });
      return;
    }
    response.json(result);
  } catch (error) {
    next(error);
  }
});

// Endpoint tổng quan dữ liệu ban đầu cho trang chủ và ứng dụng (Data Bundle)
app.get("/api/initial-data", async (_request, response, next) => {
  try {
    const [teachers] = await database.query(
      "SELECT id, name, slug, role_title AS roleTitle, class_name AS className, bio, avatar_url AS avatarUrl, display_order AS displayOrder FROM teachers WHERE is_active = 1 ORDER BY display_order ASC, id ASC"
    );
    const [programs] = await database.query(
      "SELECT id, title, slug, category, age_group AS ageGroup, short_description AS shortDescription, description, featured_image AS featuredImage, display_order AS displayOrder FROM programs WHERE is_active = 1 ORDER BY display_order ASC, id ASC"
    );
    const [testimonials] = await database.query(
      "SELECT id, parent_name AS parentName, slug, child_name AS childName, relationship, avatar_url AS avatarUrl, content, rating, display_order AS displayOrder FROM testimonials WHERE is_featured = 1 ORDER BY display_order ASC, id ASC"
    );
    const [events] = await database.query(
      "SELECT id, title, slug, summary, content, featured_image AS featuredImage, DATE_FORMAT(event_date, '%Y-%m-%d %H:%i:%s') AS eventDate, location, CASE WHEN event_date IS NULL THEN status WHEN DATE(event_date) > DATE(DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR)) THEN 'upcoming' WHEN DATE(event_date) = DATE(DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR)) THEN 'ongoing' ELSE 'completed' END AS status FROM events ORDER BY event_date DESC, id DESC"
    );
    const [posts] = await database.query(
      "SELECT id, title, slug, category, excerpt, body, featured_image AS featuredImage, DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') AS publishedAt, is_featured AS isFeatured FROM posts ORDER BY published_at DESC, id DESC"
    );
    const [contentItems] = await database.query(
      "SELECT id, type, slug, title, DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') AS date, excerpt, body, featured_image AS featuredImage FROM content_items ORDER BY published_at DESC, id DESC"
    );

    response.json({
      teachers,
      programs,
      testimonials,
      events,
      posts,
      contentItems,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/content", async (request, response, next) => {
  const { type } = request.query;
  const parsedLimit = Number.parseInt(request.query.limit, 10);
  const limit = Number.isFinite(parsedLimit)
    ? Math.max(1, Math.min(parsedLimit, 100))
    : 100;

  try {
    const [items] = type
      ? await database.execute(
          "SELECT id, type, slug, title, DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') AS date, excerpt, body, featured_image AS featuredImage FROM content_items WHERE type = ? ORDER BY published_at DESC, id DESC LIMIT ?",
          [type, limit],
        )
      : await database.execute(
          "SELECT id, type, slug, title, DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') AS date, excerpt, body, featured_image AS featuredImage FROM content_items ORDER BY published_at DESC, id DESC LIMIT ?",
          [limit],
        );
    response.json(items);
  } catch (error) {
    next(error);
  }
});

app.get("/api/content/:slug", async (request, response, next) => {
  try {
    const [items] = await database.execute(
      "SELECT id, type, slug, title, DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') AS date, excerpt, body, featured_image AS featuredImage FROM content_items WHERE slug = ? ORDER BY (type = 'page') DESC, published_at DESC, id DESC LIMIT 1",
      [request.params.slug],
    );
    if (!items.length) {
      response.status(404).json({ error: "Không tìm thấy nội dung." });
      return;
    }
    response.json(items[0]);
  } catch (error) {
    next(error);
  }
});

app.post("/api/contact", async (request, response) => {
  const { name, phone, email, message } = request.body ?? {};
  const clean = {
    name: typeof name === "string" ? name.trim() : "",
    phone: typeof phone === "string" ? phone.trim() : "",
    email: typeof email === "string" ? email.trim() : "",
    message: typeof message === "string" ? message.trim() : "",
  };

  if (
    clean.name.length < 2 ||
    clean.name.length > 100 ||
    !/^[+0-9()\-\s]{8,20}$/.test(clean.phone) ||
    clean.message.length < 10 ||
    clean.message.length > 2000 ||
    (clean.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email))
  ) {
    response.status(400).json({ error: "Vui lòng kiểm tra lại thông tin." });
    return;
  }

  // Lưu luôn vào bảng contact_submissions để quản trị viên có thể theo dõi danh sách đăng ký
  try {
    await database.execute(
      "INSERT INTO contact_submissions (name, phone, email, message, status) VALUES (?, ?, ?, ?, 'new')",
      [clean.name, clean.phone, clean.email || null, clean.message],
    );
  } catch (dbError) {
    console.error("Could not record submission to database:", dbError.message);
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_TO, CONTACT_FROM } =
    process.env;
  if (
    !SMTP_HOST ||
    !SMTP_USER ||
    !SMTP_PASSWORD ||
    !CONTACT_TO ||
    !CONTACT_FROM
  ) {
    // Nếu chưa thiết lập SMTP, vẫn ghi nhận thành công vào Database để không làm gián đoạn trải nghiệm của phụ huynh
    response.status(200).json({
      message: "Đã gửi thông tin thành công! Nhà trường sẽ liên hệ với ba mẹ sớm nhất.",
    });
    return;
  }

  const port = Number.parseInt(SMTP_PORT || "587", 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    response.status(500).json({ error: "Cấu hình email không hợp lệ." });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });

    await transporter.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: clean.email || undefined,
      subject: "[Happy Montessori] Thông tin phụ huynh mới",
      text: [
        `Họ tên: ${clean.name}`,
        `Điện thoại: ${clean.phone}`,
        `Email: ${clean.email || "Không cung cấp"}`,
        "",
        clean.message,
      ].join("\n"),
    });

    response.status(202).json({ message: "Đã gửi thông tin thành công." });
  } catch (error) {
    console.error("Contact email delivery failed:", error.message);
    response.status(502).json({
      error: "Chưa gửi được yêu cầu. Vui lòng thử lại hoặc liên hệ qua điện thoại.",
    });
  }
});

function getRegistrationTokenHash(request) {
  const authorization = request.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) return null;

  const token = authorization.slice(7);
  if (!/^[a-f0-9]{64}$/i.test(token)) return null;
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function findRegistrationByToken(id, tokenHash) {
  if (!tokenHash || !/^\d+$/.test(String(id))) return null;
  const [rows] = await database.execute(
    "SELECT id, payment_image_filename AS paymentImageFilename FROM contact_submissions WHERE id = ? AND submission_type = 'enrollment' AND registration_token_hash = ? LIMIT 1",
    [id, tokenHash],
  );
  return rows[0] || null;
}

function isFutureEnrollmentDate(value) {
  if (value === null || value === "") return true;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return false;
  }

  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() > today;
}

async function sendRegistrationEmails(registration, id) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_TO, CONTACT_FROM } =
    process.env;
  if (
    !SMTP_HOST ||
    !SMTP_USER ||
    !SMTP_PASSWORD ||
    !CONTACT_TO ||
    !CONTACT_FROM
  ) {
    throw new Error("Registration email SMTP settings are incomplete.");
  }

  const port = Number.parseInt(SMTP_PORT || "587", 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Registration email SMTP port is invalid.");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
  const enrollmentDate = registration.enrollmentDate || "Chưa chọn";
  const parentEmail = {
    from: CONTACT_FROM,
    to: registration.parentEmail,
    replyTo: CONTACT_TO,
    subject: "Happy Montessori đã nhận đăng ký nhập học",
    text: [
      `Kính gửi ${registration.parentName},`,
      "",
      "Happy Montessori đã nhận được thông tin đăng ký nhập học cho bé:",
      `Họ tên của bé: ${registration.childName}`,
      `Độ tuổi: ${registration.childAgeMonths} tháng`,
      `Ngày nhập học dự kiến: ${enrollmentDate}`,
      "",
      "Bộ phận tuyển sinh sẽ liên hệ với ba mẹ để hướng dẫn hoàn thiện hồ sơ.",
      "Trân trọng,",
      "Trường Mầm non Happy Montessori",
    ].join("\n"),
  };
  const schoolEmail = {
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: registration.parentEmail,
    subject: `[Happy Montessori] Đăng ký nhập học mới #${id}`,
    text: [
      "Có đăng ký nhập học mới trên website Happy Montessori.",
      "",
      `Mã đăng ký: ${id}`,
      `Phụ huynh: ${registration.parentName}`,
      `Điện thoại: ${registration.parentPhone}`,
      `Email: ${registration.parentEmail}`,
      `Địa chỉ: ${registration.parentAddress}`,
      `Họ tên của bé: ${registration.childName}`,
      `Độ tuổi: ${registration.childAgeMonths} tháng`,
      `Ngày nhập học dự kiến: ${enrollmentDate}`,
    ].join("\n"),
  };

  const results = await Promise.allSettled([
    transporter.sendMail(parentEmail),
    transporter.sendMail(schoolEmail),
  ]);
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `Registration ${index === 0 ? "parent" : "school"} email delivery failed:`,
        result.reason?.message || result.reason,
      );
    }
  });

  return results.every((result) => result.status === "fulfilled");
}

app.post("/api/registration/create", async (request, response, next) => {
  const body = request.body ?? {};
  const registration = {
    parentName: typeof body.parentName === "string" ? body.parentName.trim() : "",
    parentPhone: typeof body.parentPhone === "string" ? body.parentPhone.trim() : "",
    parentAddress:
      typeof body.parentAddress === "string" ? body.parentAddress.trim() : "",
    parentEmail: typeof body.parentEmail === "string" ? body.parentEmail.trim() : "",
    childName: typeof body.childName === "string" ? body.childName.trim() : "",
    childAgeMonths: body.childAgeMonths,
    enrollmentDate:
      body.enrollmentDate === undefined ||
      body.enrollmentDate === null ||
      body.enrollmentDate === ""
        ? null
        : body.enrollmentDate,
  };

  if (
    registration.parentName.length < 2 ||
    registration.parentName.length > 100 ||
    !/^\d{10}$/.test(registration.parentPhone) ||
    registration.parentAddress.length < 5 ||
    registration.parentAddress.length > 500 ||
    registration.parentEmail.length > 255 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.parentEmail) ||
    registration.childName.length < 2 ||
    registration.childName.length > 100 ||
    !Number.isInteger(registration.childAgeMonths) ||
    registration.childAgeMonths < 6 ||
    registration.childAgeMonths > 72 ||
    !isFutureEnrollmentDate(registration.enrollmentDate)
  ) {
    response.status(400).json({ error: "Vui lòng kiểm tra lại thông tin đăng ký." });
    return;
  }

  const paymentToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(paymentToken).digest("hex");

  try {
    const [result] = await database.execute(
      "INSERT INTO contact_submissions (name, phone, email, child_name, child_age, submission_type, parent_address, child_age_months, enrollment_date, payment_status, registration_token_hash, message, status) VALUES (?, ?, ?, ?, ?, 'enrollment', ?, ?, ?, 'unpaid', ?, 'Đăng ký nhập học', 'new')",
      [
        registration.parentName,
        registration.parentPhone,
        registration.parentEmail || null,
        registration.childName,
        `${registration.childAgeMonths} tháng`,
        registration.parentAddress,
        registration.childAgeMonths,
        registration.enrollmentDate,
        tokenHash,
      ],
    );

    let emailNotificationsSent = false;
    try {
      emailNotificationsSent = await sendRegistrationEmails(
        registration,
        result.insertId,
      );
    } catch (emailError) {
      console.error("Registration email delivery failed:", emailError.message);
    }

    response.status(201).json({
      success: true,
      id: result.insertId,
      paymentToken,
      emailNotificationsSent,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/registration/:id/payment", async (request, response, next) => {
  const { id } = request.params;
  if (request.body?.status !== "later") {
    response.status(400).json({ error: "Trạng thái thanh toán không hợp lệ." });
    return;
  }

  try {
    const tokenHash = getRegistrationTokenHash(request);
    const registration = await findRegistrationByToken(id, tokenHash);
    if (!registration) {
      response.status(403).json({ error: "Không thể xác thực đăng ký này." });
      return;
    }

    await database.execute(
      "UPDATE contact_submissions SET payment_status = 'later' WHERE id = ? AND registration_token_hash = ?",
      [id, tokenHash],
    );
    response.json({ success: true, paymentStatus: "later" });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/api/registration/:id/payment-proof",
  express.raw({ type: "*/*", limit: "5mb" }),
  async (request, response, next) => {
    const { id } = request.params;
    const image = request.body;

    if (!Buffer.isBuffer(image) || image.length === 0) {
      response.status(400).json({ error: "Vui lòng chọn ảnh biên nhận hợp lệ." });
      return;
    }

    const format = getImageFormat(image);
    if (!format) {
      response.status(415).json({ error: "Tệp tải lên không phải ảnh được hỗ trợ." });
      return;
    }

    try {
      const tokenHash = getRegistrationTokenHash(request);
      const registration = await findRegistrationByToken(id, tokenHash);
      if (!registration) {
        response.status(403).json({ error: "Không thể xác thực đăng ký này." });
        return;
      }

      const uploadDirectory = path.join(root, "storage", "registration-payments");
      const fileName = `${crypto.randomUUID()}.${format.extension}`;
      const filePath = path.join(uploadDirectory, fileName);
      await mkdir(uploadDirectory, { recursive: true });
      await writeFile(filePath, image, { flag: "wx" });

      try {
        const [result] = await database.execute(
          "UPDATE contact_submissions SET payment_status = 'proof_submitted', payment_image_filename = ? WHERE id = ? AND registration_token_hash = ?",
          [fileName, id, tokenHash],
        );
        if (!result.affectedRows) {
          await unlink(filePath);
          response.status(403).json({ error: "Không thể xác thực đăng ký này." });
          return;
        }
      } catch (error) {
        try {
          await unlink(filePath);
        } catch (cleanupError) {
          console.error("Could not remove unlinked payment proof:", cleanupError.message);
        }
        throw error;
      }

      if (registration.paymentImageFilename) {
        const previousPath = path.join(
          uploadDirectory,
          registration.paymentImageFilename,
        );
        try {
          await unlink(previousPath);
        } catch (error) {
          if (error.code !== "ENOENT") {
            console.error("Could not remove previous payment proof:", error.message);
          }
        }
      }

      response.status(201).json({ success: true, paymentStatus: "proof_submitted" });
    } catch (error) {
      next(error);
    }
  },
);

app.use("/api/admin", createAdminRouter({ database, root }));

app.use((error, _request, response, _next) => {
  console.error("Request failed:", error.message);
  if (error.status === 413) {
    response.status(413).json({ error: "Ảnh không được vượt quá 5 MB." });
    return;
  }
  response.status(500).json({ error: "Máy chủ chưa xử lý được yêu cầu." });
});

app.use("/media", express.static(path.join(root, "public", "media")));

if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (_request, response) => {
    response.sendFile(path.join(distPath, "index.html"));
  });
}

const port = Number.parseInt(process.env.PORT || "3001", 10);
async function start() {
  await verifyDatabase(database);
  app.listen(port, "0.0.0.0", () => {
    console.log(`HappyMon server listening on http://0.0.0.0:${port}`);
  });
}

start().catch(async (error) => {
  console.error("Could not start HappyMon server:", error.message);
  await database.end();
  process.exitCode = 1;
});
