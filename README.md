# Happy Montessori — React + Node.js

This is a new application based on the public, published content in the WordPress backup. It does not run or restore the original WordPress/PHP code.

## Import public content

1. Extract the SQL member from the database backup to a private temporary location.
2. Run the exporter with Python 3.10 or later:

   ```powershell
   python scripts/import-wordpress-backup.py --sql "C:\path\to\backup.sql" --output src\data\content.json
   ```

3. Extract only the published items' featured images:

   ```powershell
   python scripts/extract-featured-media.py --archive "C:\path\to\backup_user-data.tzst" --content src\data\content.json --destination public\media
   ```

The exporter includes published pages, posts, events, courses, team profiles, testimonials, and products. It excludes user accounts, submitted forms, orders, and drafts.

## Configure MySQL

Requires a running MySQL 8+ server and Node.js 20.12+.

1. In MySQL Workbench, create an empty database and a dedicated MySQL user with `CREATE`, `SELECT`, `INSERT`, and `UPDATE` privileges on that database. For example:

   ```sql
   CREATE DATABASE IF NOT EXISTS happymon_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER IF NOT EXISTS 'happymon_app'@'localhost' IDENTIFIED BY 'set-a-new-random-password';
   ALTER USER 'happymon_app'@'localhost' IDENTIFIED BY 'set-a-new-random-password';
   GRANT CREATE, SELECT, INSERT, UPDATE ON happymon_app.* TO 'happymon_app'@'localhost';
   ```

   Replace both example password values with the same new random password. The `localhost` account matches the host MySQL reports for the local connection. Do not use any password or key from the Plesk backup.
2. Set `DB_PASSWORD` in `.env` to that same password (quotes are recommended for special characters); adjust the database/user names there if you chose different names. Never commit or share `.env`.
3. Import the published JSON content into MySQL:

   ```powershell
   npm run db:import
   ```

## Cấu trúc Cơ sở Dữ liệu Chuẩn hóa (Normalized Schema)

Dữ liệu sao lưu từ project đã được phân tích, tách lớp và chuẩn hóa thành các bảng thực thể riêng biệt trong MySQL:

1. **`teachers`**: Đội ngũ giáo viên và cán bộ nhân viên nhà trường (12 giáo viên: họ tên, lớp phụ trách như Newton 1-4, Teresa, ảnh đại diện, chức danh, thứ tự hiển thị).
2. **`programs`**: Chương trình đào tạo & Câu lạc bộ năng khiếu (7 mục: Chương trình Montessori, Tiếng Anh, Kỹ năng sống, Dinh dưỡng, CLB võ thuật, CLB âm nhạc, CLB nhảy hiện đại).
3. **`testimonials`**: Cảm nhận và đánh giá từ phụ huynh học sinh (7 bài chia sẻ, kèm tên bé, đánh giá 5 sao, ảnh và nội dung phản hồi).
4. **`events`**: Hoạt động ngoại khóa & Sự kiện của trường (6 sự kiện: Hội chợ Xuân, Giáng sinh, Bé vui đón Tết, Làm nghệ nhân gốm sứ Bát Tràng, Tham quan Văn miếu Mao Điền...).
5. **`posts`**: Tin tức, bài viết chuyên đề nuôi dạy con, Quỹ học bổng (45 bài viết).
6. **`pages`**: Các trang thông tin tĩnh (Giới thiệu, Cơ sở vật chất, Thông báo tuyển sinh, Hướng dẫn tuyển sinh, Triết lý Hạnh phúc - Trí tuệ - Nhân ái...).
7. **`products`**: Sản phẩm, đồng phục và balo học sinh.
8. **`contact_submissions`**: Lưu trữ trực tiếp các đăng ký nhập học và thông tin phụ huynh.
9. **`content_items`**: Bảng tổng hợp dữ liệu gốc phục vụ truy vấn tương thích ngược.

### Lệnh khởi tạo và Import Database

Để tạo toàn bộ các bảng và tự động phân loại, import dữ liệu từ bản backup vào MySQL:

```powershell
npm run db:import
```

Schema chi tiết được định nghĩa tại `server/schema.sql` và logic migration tại `scripts/migrate-normalized-db.js`.
Nếu database đã được import trước đó, chạy `npm run db:migrate-store` để thêm lựa chọn kích cỡ cho sản phẩm.

If MySQL reports `Access denied for user ... @localhost`, run the `CREATE USER`, `ALTER USER`, and `GRANT` statements above in MySQL Workbench as an administrator, then make sure `.env` contains the exact same new password.

## Run locally

Requires Python 3.10+ only if re-importing the original WordPress backup.

```powershell
npm install
npm run dev:server
npm run dev:client
```

Open the Vite URL printed by the client command. For production, run `npm run build` and then `npm start`.

To send enrollment notifications, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_FROM`, and `CONTACT_TO` in `.env`. Each registration sends a confirmation to the required parent email and a notification to the school address in `CONTACT_TO`. If email delivery is unavailable, the registration is still saved and the API/UI reports that notifications were not sent.

## Admin feature structure

Admin UI files are grouped by feature under `src/admin/features/`. Each feature owns its view, form fields, and API client; reusable request helpers, display utilities, and components are under `src/admin/shared/`. `AdminDashboard.jsx` composes the feature views and coordinates shared session state.

Admin server routes follow the same feature grouping under `server/routes/admin/`. `server/routes/admin/index.js` composes the routers, while `server/index.js` mounts them at `/api/admin`.

The public home page is composed from focused sections under `src/features/home/`. Shared site cards remain under `src/components/`, and the site header is composed from brand, desktop navigation, and mobile navigation components under `src/components/header/`.
