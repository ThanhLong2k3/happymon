import { Link } from "react-router-dom";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

export default function BrandBar() {
  return (
    <div className="site-brandbar">
      <div className="site-container topline-inner">
        <Link to="/" className="brand-logo">
          <img
            className="brand-icon"
            src="/media/2022/08/cropped-HappyMon-Logo-150.png"
            alt="Logo Trường Mầm non Happy Montessori"
            width="150"
            height="150"
          />
          <div className="brand-text">
            <strong>MẦM NON HAPPY MONTESSORI</strong>
            <small>HẠNH PHÚC · TRÍ TUỆ · NHÂN ÁI</small>
          </div>
        </Link>

        <div className="brand-contact">
          <a href="tel:0985638855" className="brand-contact-item">
            <span className="brand-contact-icon">
              <PhoneOutlined />
            </span>
            <span>
              <small>Gọi cho chúng tôi</small>
              <strong>098 563 88 55</strong>
            </span>
          </a>
          <a
            href="mailto:tuyensinh@happymon.edu.vn"
            className="brand-contact-item"
          >
            <span className="brand-contact-icon">
              <MailOutlined />
            </span>
            <span>
              <small>Email</small>
              <strong>tuyensinh@happymon.edu.vn</strong>
            </span>
          </a>
          <Link to="/lien-he" className="brand-visit-button">
            <CalendarOutlined /> Đăng ký nhập học <ArrowRightOutlined />
          </Link>
        </div>
      </div>
    </div>
  );
}
