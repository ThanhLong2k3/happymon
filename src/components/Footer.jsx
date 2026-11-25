import { Link } from "react-router-dom";
import { Row, Col, Space } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  HeartFilled,
} from "@ant-design/icons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <Row gutter={[40, 36]} className="footer-grid">
          <Col xs={24} md={10}>
            <div className="footer-brand-title">
              TRƯỜNG MẦM NON HAPPY MONTESSORI
            </div>
            <p
              style={{
                lineHeight: 1.8,
                color: "#c2d4c6",
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              Môi trường giáo dục Montessori chuẩn mực, lấy trẻ làm trung tâm,
              tôn trọng nhịp độ phát triển tự nhiên giúp mỗi em bé tự tin, độc
              lập và tràn ngập tình yêu thương.
            </p>
            <Space
              direction="vertical"
              size="small"
              style={{ color: "#dbe5de", fontSize: 13 }}
            >
              <div>
                <EnvironmentOutlined
                  style={{ color: "#e5bd61", marginRight: 8 }}
                />{" "}
                Số 3 Đường Bùi Thị Cúc, Mỹ Hào, Hưng Yên
              </div>
              <div>
                <PhoneOutlined style={{ color: "#e5bd61", marginRight: 8 }} />{" "}
                Hotline: <strong>0961 348 219</strong>
              </div>
              <div>
                <MailOutlined style={{ color: "#e5bd61", marginRight: 8 }} />{" "}
                Email: happymon247@gmail.com
              </div>
            </Space>
          </Col>

          <Col xs={12} md={7}>
            <div className="footer-col-title">Chương trình & Đào tạo</div>
            <ul className="footer-links">
              <li>
                <Link to="/gioi-thieu">Về Happy Montessori</Link>
              </li>
              <li>
                <Link to="/chuong-trinh">Chương trình Montessori</Link>
              </li>
              <li>
                <Link to="/chuong-trinh">Tiếng Anh & Nghệ thuật</Link>
              </li>
              <li>
                <Link to="/doi-ngu">Đội ngũ giáo viên</Link>
              </li>
              <li>
                <Link to="/tuyen-sinh">Thông tin tuyển sinh</Link>
              </li>
            </ul>
          </Col>

          <Col xs={12} md={7}>
            <div className="footer-col-title">Kết nối & Hoạt động</div>
            <ul className="footer-links">
              <li>
                <Link to="/hoat-dong">Hoạt động ngoại khóa</Link>
              </li>
              <li>
                <Link to="/cam-nhan">Góc chia sẻ của phụ huynh</Link>
              </li>
              <li>
                <Link to="/bai-viet">Kiến thức nuôi dạy con</Link>
              </li>
              <li>
                <Link to="/cua-hang">Cửa hàng đồng phục</Link>
              </li>
              <li>
                <Link to="/lien-he">Đăng ký nhập học</Link>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Mầm non Happy Montessori — Hệ thống
            giáo dục toàn diện.
          </span>
          <Space size="middle">
            <span>
              Được tạo nên với sự tận tâm{" "}
              <HeartFilled style={{ color: "#e5bd61" }} />
            </span>
            <Link
              to="/admin"
              style={{ color: "#92a396", opacity: 0.6, fontSize: 11 }}
            >
              Portal Quản Trị ↗
            </Link>
          </Space>
        </div>
      </div>
    </footer>
  );
}
