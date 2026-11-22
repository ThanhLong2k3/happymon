-- Schema cơ sở dữ liệu Happy Montessori (chuẩn hóa các bảng riêng biệt theo từng đối tượng)
-- Database: happymon_app

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Bảng Đội ngũ giáo viên / nhân sự (Teachers & Staff)
CREATE TABLE IF NOT EXISTS teachers (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  wp_post_id BIGINT UNSIGNED NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  role_title VARCHAR(255) DEFAULT '',       -- Ví dụ: 'Giáo viên lớp Newton 3', 'Giáo viên lớp Teresa', 'Hiệu trưởng'
  class_name VARCHAR(100) DEFAULT '',       -- Lớp phụ trách: 'Newton 1', 'Newton 2', 'Newton 3', 'Newton 4', 'Teresa', v.v.
  bio TEXT NULL,                            -- Tiểu sử, quá trình đào tạo
  avatar_url VARCHAR(500) NULL,             -- Đường dẫn ảnh đại diện
  display_order INT DEFAULT 0,              -- Thứ tự hiển thị
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_teacher_active (is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Chương trình học & Câu lạc bộ (Curriculums & Clubs)
CREATE TABLE IF NOT EXISTS programs (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  wp_post_id BIGINT UNSIGNED NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category ENUM('montessori', 'club', 'english', 'skill', 'nutrition') DEFAULT 'club',
  age_group VARCHAR(100) DEFAULT '18 tháng - 6 tuổi',
  short_description TEXT NULL,
  description LONGTEXT NULL,
  featured_image VARCHAR(500) NULL,
  schedule VARCHAR(255) NULL,               -- Thời gian hoạt động / lịch sinh hoạt
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_program_cat (category, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Cảm nhận / Đánh giá của phụ huynh (Parent Testimonials)
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  wp_post_id BIGINT UNSIGNED NULL UNIQUE,
  parent_name VARCHAR(255) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  child_name VARCHAR(100) DEFAULT '',       -- Ví dụ: Bé Ong, Bé Tuệ An, ...
  relationship VARCHAR(100) DEFAULT 'Phụ huynh', -- 'Mẹ bé', 'Bố bé', 'Phụ huynh học sinh'
  avatar_url VARCHAR(500) NULL,
  content TEXT NOT NULL,
  rating TINYINT UNSIGNED DEFAULT 5,
  display_order INT DEFAULT 0,
  is_featured TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_testimonial_featured (is_featured, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Hoạt động ngoại khóa & Sự kiện (Events & Activities)
CREATE TABLE IF NOT EXISTS events (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  wp_post_id BIGINT UNSIGNED NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  summary TEXT NULL,
  content LONGTEXT NULL,
  featured_image VARCHAR(500) NULL,
  event_date DATETIME NULL,
  location VARCHAR(255) DEFAULT 'Trường Mầm non Happy Montessori',
  status ENUM('upcoming', 'completed', 'ongoing') DEFAULT 'completed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_event_date (event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Tin tức, bài viết chia sẻ, kiến thức nuôi dạy con (Articles / Posts)
CREATE TABLE IF NOT EXISTS posts (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  wp_post_id BIGINT UNSIGNED NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category VARCHAR(100) DEFAULT 'Góc chia sẻ', -- 'Góc phụ huynh', 'Tin tức & sự kiện', 'Học bổng', ...
  excerpt TEXT NULL,
  body LONGTEXT NOT NULL,
  featured_image VARCHAR(500) NULL,
  published_at DATETIME NULL,
  view_count INT UNSIGNED DEFAULT 0,
  is_featured TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_post_pub (published_at),
  KEY idx_post_cat (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng Các trang nội dung tĩnh & Thông tin tuyển sinh, giới thiệu (Static Pages)
CREATE TABLE IF NOT EXISTS pages (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  wp_post_id BIGINT UNSIGNED NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category VARCHAR(100) DEFAULT 'general', -- 'about', 'admission', 'facilities', 'values', ...
  excerpt TEXT NULL,
  body LONGTEXT NOT NULL,
  featured_image VARCHAR(500) NULL,
  display_order INT DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng Sản phẩm, đồng phục & giáo cụ (Products)
CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  wp_post_id BIGINT UNSIGNED NULL UNIQUE,
  name VARCHAR(500) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category VARCHAR(100) DEFAULT 'Đồng phục',
  price DECIMAL(12,2) DEFAULT 0.00,
  description LONGTEXT NULL,
  image_url VARCHAR(500) NULL,
  sizes VARCHAR(255) NOT NULL DEFAULT '',
  in_stock TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7b. Bảng Chiến dịch tuyển sinh & Ưu đãi (Promotions & Countdowns)
CREATE TABLE IF NOT EXISTS promotions (
  id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  start_date DATETIME NULL,
  end_date DATETIME NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  tier1 VARCHAR(255) NULL,
  tier2 VARCHAR(255) NULL,
  tier3 VARCHAR(255) NULL,
  tier4 VARCHAR(255) NULL,
  tier5 VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_promotion_active (is_active, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng lưu đăng ký nhập học và thông tin phụ huynh
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(255) NULL,
  child_name VARCHAR(100) NULL,
  child_age VARCHAR(50) NULL,
  submission_type ENUM('contact', 'enrollment') NOT NULL DEFAULT 'contact',
  parent_address VARCHAR(500) NULL,
  child_age_months SMALLINT UNSIGNED NULL,
  enrollment_date DATE NULL,
  payment_status ENUM('unpaid', 'later', 'proof_submitted') NOT NULL DEFAULT 'unpaid',
  payment_image_filename VARCHAR(100) NULL,
  registration_token_hash CHAR(64) NULL,
  program_interest VARCHAR(100) NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'contacted', 'scheduled', 'enrolled', 'cancelled') DEFAULT 'new',
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_registration_token_hash (registration_token_hash),
  KEY idx_contact_created (created_at),
  KEY idx_contact_status (status),
  KEY idx_contact_type_status (submission_type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Giữ lại bảng tổng hợp content_items để tương thích ngược nếu cần
CREATE TABLE IF NOT EXISTS content_items (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
  type VARCHAR(40) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  title VARCHAR(500) NOT NULL,
  published_at DATETIME NULL,
  excerpt TEXT NOT NULL,
  body LONGTEXT NOT NULL,
  featured_image VARCHAR(500) NULL,
  UNIQUE KEY uq_content_type_slug (type, slug),
  KEY idx_content_type_date (type, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- 10. Bảng Quản trị viên hệ thống (Admins)
CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NULL,
  role ENUM('admin', 'editor') DEFAULT 'admin',
  last_login DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
