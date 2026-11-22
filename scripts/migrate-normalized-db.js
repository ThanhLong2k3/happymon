import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabasePool } from "../server/db.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(root, "src", "data", "content.json");
const schemaPath = path.join(root, "server", "schema.sql");

if (existsSync(path.join(root, ".env"))) {
  process.loadEnvFile(path.join(root, ".env"));
}

if (!existsSync(contentPath)) {
  throw new Error("Missing src/data/content.json.");
}

const content = JSON.parse(readFileSync(contentPath, "utf8"));
if (!Array.isArray(content)) {
  throw new Error("The content export is not an array.");
}

const database = createDatabasePool();

function parseDate(dateStr) {
  if (
    typeof dateStr === "string" &&
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)
  ) {
    return dateStr;
  }
  return null;
}

try {
  console.log("1. Đang khởi tạo các bảng chuẩn hóa trong MySQL...");
  const schemaSql = readFileSync(schemaPath, "utf8");

  // Loại bỏ comment và tách các câu lệnh SQL
  const cleanSql = schemaSql.replace(/--.*$/gm, "");
  const statements = cleanSql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    if (stmt.trim()) {
      await database.query(stmt);
    }
  }
  console.log("   Khởi tạo cấu trúc các bảng thành công.");

  const connection = await database.getConnection();
  try {
    await connection.beginTransaction();

    // Import vào bảng tổng hợp content_items (duy trì tương thích)
    console.log("2. Đang nhập dữ liệu vào bảng content_items...");
    const insertContent = `
      INSERT INTO content_items
        (id, type, slug, title, published_at, excerpt, body, featured_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        type = VALUES(type),
        slug = VALUES(slug),
        title = VALUES(title),
        published_at = VALUES(published_at),
        excerpt = VALUES(excerpt),
        body = VALUES(body),
        featured_image = VALUES(featured_image)
    `;
    for (const item of content) {
      await connection.execute(insertContent, [
        item.id,
        item.type,
        item.slug,
        item.title,
        parseDate(item.date),
        item.excerpt || "",
        item.body || "",
        item.featuredImage || null,
      ]);
    }

    // 3. Phân loại và nhập bảng teachers (12 giáo viên)
    console.log("3. Đang chuẩn hóa và nhập dữ liệu bảng 'teachers'...");
    const teachers = content.filter((item) => item.type === "team");
    const insertTeacher = `
      INSERT INTO teachers
        (wp_post_id, name, slug, role_title, class_name, bio, avatar_url, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        slug = VALUES(slug),
        role_title = VALUES(role_title),
        class_name = VALUES(class_name),
        bio = VALUES(bio),
        avatar_url = VALUES(avatar_url),
        display_order = VALUES(display_order)
    `;

    for (let i = 0; i < teachers.length; i++) {
      const t = teachers[i];
      let roleTitle = t.excerpt ? t.excerpt.trim() : "";
      let className = "";

      const classMatch = roleTitle.match(/(?:lớp|Lớp)\s+([A-Za-z0-9\s]+)/i);
      if (classMatch) {
        className = classMatch[1].trim();
      }

      // Đặt chức danh nếu chưa có
      if (!roleTitle) {
        if (t.title.includes("Huyền"))
          roleTitle = "Phó Hiệu trưởng phụ trách chuyên môn";
        else if (t.title.includes("Phương Anh"))
          roleTitle = "Giáo viên Montessori Quốc tế";
        else roleTitle = "Giáo viên Montessori";
      }

      await connection.execute(insertTeacher, [
        t.id,
        t.title.trim(),
        t.slug,
        roleTitle,
        className,
        t.body || roleTitle,
        t.featuredImage || null,
        i + 1,
      ]);
    }
    console.log(`   Đã nhập ${teachers.length} giáo viên vào bảng 'teachers'.`);

    // 4. Phân loại và nhập bảng programs (chương trình học và câu lạc bộ)
    console.log("4. Đang chuẩn hóa và nhập dữ liệu bảng 'programs'...");
    const courses = content.filter((item) => item.type === "course");
    const curriculumPages = content.filter(
      (item) =>
        item.type === "page" &&
        [
          "chuong-trinh-montessori",
          "chuong-trinh-tieng-anh",
          "ren-luyen-ky-nang-song",
          "dinh-duong-cho-be",
        ].includes(item.slug),
    );

    const insertProgram = `
      INSERT INTO programs
        (wp_post_id, title, slug, category, age_group, short_description, description, featured_image, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        slug = VALUES(slug),
        category = VALUES(category),
        age_group = VALUES(age_group),
        short_description = VALUES(short_description),
        description = VALUES(description),
        featured_image = VALUES(featured_image),
        display_order = VALUES(display_order)
    `;

    // Nhập các môn/trang trọng tâm trước
    let progOrder = 1;
    for (const p of curriculumPages) {
      let cat = "montessori";
      if (p.slug.includes("tieng-anh")) cat = "english";
      else if (p.slug.includes("ky-nang")) cat = "skill";
      else if (p.slug.includes("dinh-duong")) cat = "nutrition";

      await connection.execute(insertProgram, [
        p.id,
        p.title,
        p.slug,
        cat,
        "18 tháng - 6 tuổi",
        p.excerpt || p.body.slice(0, 200),
        p.body,
        p.featuredImage || null,
        progOrder++,
      ]);
    }

    // Nhập các câu lạc bộ (courses)
    for (const c of courses) {
      await connection.execute(insertProgram, [
        c.id,
        c.title,
        c.slug,
        "club",
        "3 tuổi - 6 tuổi",
        c.excerpt || c.body.slice(0, 200),
        c.body,
        c.featuredImage || null,
        progOrder++,
      ]);
    }
    console.log(
      `   Đã nhập ${curriculumPages.length + courses.length} chương trình & câu lạc bộ vào bảng 'programs'.`,
    );

    // 5. Chuẩn hóa và nhập bảng testimonials (7 nhận xét của phụ huynh)
    console.log("5. Đang chuẩn hóa và nhập dữ liệu bảng 'testimonials'...");
    const testimonials = content.filter((item) => item.type === "testimonial");
    const insertTestimonial = `
      INSERT INTO testimonials
        (wp_post_id, parent_name, slug, child_name, relationship, avatar_url, content, rating, display_order, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, 5, ?, 1)
      ON DUPLICATE KEY UPDATE
        parent_name = VALUES(parent_name),
        slug = VALUES(slug),
        child_name = VALUES(child_name),
        relationship = VALUES(relationship),
        avatar_url = VALUES(avatar_url),
        content = VALUES(content),
        display_order = VALUES(display_order)
    `;

    for (let i = 0; i < testimonials.length; i++) {
      const item = testimonials[i];
      let childName = "";
      if (item.title.includes("Hiên") || item.body.includes("bạn Ong"))
        childName = "Bé Ong (Thanh Chúc)";
      else if (item.title.includes("Hồng") || item.body.includes("Tuệ An"))
        childName = "Bé Tuệ An";

      await connection.execute(insertTestimonial, [
        item.id,
        item.title.trim(),
        item.slug,
        childName,
        "Phụ huynh học sinh",
        item.featuredImage || null,
        item.body || item.excerpt,
        i + 1,
      ]);
    }
    console.log(
      `   Đã nhập ${testimonials.length} cảm nhận phụ huynh vào bảng 'testimonials'.`,
    );

    // 6. Chuẩn hóa và nhập bảng events (6 sự kiện / hoạt động ngoại khóa)
    console.log("6. Đang chuẩn hóa và nhập dữ liệu bảng 'events'...");
    const events = content.filter((item) => item.type === "event");
    const insertEvent = `
      INSERT INTO events
        (wp_post_id, title, slug, summary, content, featured_image, event_date, location, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Trường Mầm non Happy Montessori', 'completed')
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        slug = VALUES(slug),
        summary = VALUES(summary),
        content = VALUES(content),
        featured_image = VALUES(featured_image),
        event_date = VALUES(event_date)
    `;

    for (const ev of events) {
      await connection.execute(insertEvent, [
        ev.id,
        ev.title,
        ev.slug,
        ev.excerpt || "",
        ev.body || ev.excerpt || "",
        ev.featuredImage || null,
        parseDate(ev.date),
      ]);
    }
    console.log(
      `   Đã nhập ${events.length} hoạt động / sự kiện vào bảng 'events'.`,
    );

    // 7. Chuẩn hóa và nhập bảng posts (45 bài viết tin tức & chia sẻ)
    console.log("7. Đang chuẩn hóa và nhập dữ liệu bảng 'posts'...");
    const posts = content.filter((item) => item.type === "post");
    const insertPost = `
      INSERT INTO posts
        (wp_post_id, title, slug, category, excerpt, body, featured_image, published_at, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        slug = VALUES(slug),
        category = VALUES(category),
        excerpt = VALUES(excerpt),
        body = VALUES(body),
        featured_image = VALUES(featured_image),
        published_at = VALUES(published_at)
    `;

    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      let cat = "Góc chia sẻ";
      if (p.title.toLowerCase().includes("học bổng")) cat = "Quỹ học bổng";
      else if (
        p.title.toLowerCase().includes("khai trương") ||
        p.title.toLowerCase().includes("chúc mừng") ||
        p.title.toLowerCase().includes("ngày hội")
      ) {
        cat = "Tin tức & sự kiện";
      }

      await connection.execute(insertPost, [
        p.id,
        p.title,
        p.slug,
        cat,
        p.excerpt || "",
        p.body || "",
        p.featuredImage || null,
        parseDate(p.date),
        i < 6 ? 1 : 0,
      ]);
    }
    console.log(`   Đã nhập ${posts.length} bài viết vào bảng 'posts'.`);

    // 8. Chuẩn hóa và nhập bảng pages (25 trang thông tin tĩnh)
    console.log("8. Đang chuẩn hóa và nhập dữ liệu bảng 'pages'...");
    const pages = content.filter((item) => item.type === "page");
    const insertPage = `
      INSERT INTO pages
        (wp_post_id, title, slug, category, excerpt, body, featured_image, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        slug = VALUES(slug),
        category = VALUES(category),
        excerpt = VALUES(excerpt),
        body = VALUES(body),
        featured_image = VALUES(featured_image),
        display_order = VALUES(display_order)
    `;

    for (let i = 0; i < pages.length; i++) {
      const pg = pages[i];
      let cat = "general";
      if (
        pg.slug.includes("gioi-thieu") ||
        pg.slug.includes("ve-mam-non") ||
        pg.slug.includes("about")
      )
        cat = "about";
      else if (pg.slug.includes("tuyen-sinh")) cat = "admission";
      else if (
        pg.slug.includes("co-so-vat-chat") ||
        pg.slug.includes("vi-tri") ||
        pg.slug.includes("moi-truong")
      )
        cat = "facilities";
      else if (
        pg.slug.includes("hanh-phuc") ||
        pg.slug.includes("tri-tue") ||
        pg.slug.includes("nhan-ai")
      )
        cat = "values";

      await connection.execute(insertPage, [
        pg.id,
        pg.title,
        pg.slug,
        cat,
        pg.excerpt || "",
        pg.body || "",
        pg.featuredImage || null,
        i + 1,
      ]);
    }
    console.log(`   Đã nhập ${pages.length} trang vào bảng 'pages'.`);

    // 9. Chuẩn hóa và nhập bảng products (1 sản phẩm balo)
    console.log("9. Đang chuẩn hóa và nhập dữ liệu bảng 'products'...");
    const products = content.filter((item) => item.type === "product");
    const insertProduct = `
      INSERT INTO products
        (wp_post_id, name, slug, category, price, description, image_url, in_stock)
      VALUES (?, ?, ?, 'Đồng phục & Phụ kiện', 180000.00, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        slug = VALUES(slug),
        category = VALUES(category),
        price = VALUES(price),
        description = VALUES(description),
        image_url = VALUES(image_url)
    `;

    for (const pr of products) {
      await connection.execute(insertProduct, [
        pr.id,
        pr.title,
        pr.slug,
        pr.body || pr.excerpt,
        pr.featuredImage || null,
      ]);
    }
    console.log(`   Đã nhập ${products.length} sản phẩm vào bảng 'products'.`);

    await connection.commit();
    console.log(
      "\n HOÀN TẤT: Toàn bộ cơ sở dữ liệu đã được phân loại và chuẩn hóa thành công vào MySQL!",
    );
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
} finally {
  await database.end();
}
