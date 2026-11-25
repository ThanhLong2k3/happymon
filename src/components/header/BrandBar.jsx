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
            src="/HappyMon.png"
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
          <a href="tel:0961348219" className="brand-contact-item">
            <span className="brand-contact-icon">
              <PhoneOutlined />
            </span>
            <span>
              <small>Gọi cho chúng tôi</small>
              <strong>0961 348 219</strong>
            </span>
          </a>
          <a
            href="mailto:happymon247@gmail.com"
            className="brand-contact-item"
          >
            <span className="brand-contact-icon">
              <MailOutlined />
            </span>
            <span>
              <small>Email</small>
              <strong>happymon247@gmail.com</strong>
            </span>
          </a>
          <Link to="/lien-lac" className="brand-visit-button">
            <CalendarOutlined /> Liên lạc với chúng tôi <ArrowRightOutlined />
          </Link>
        </div>
      </div>
    </div>
  );
}
