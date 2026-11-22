import { Link } from "react-router-dom";
import { Button } from "antd";

export default function EnrollmentBanner() {
  return (
    <>
      {/* 7. Banner đăng ký nhập học */}
      <section className="site-section" style={{ padding: "40px 0" }}>
        <div className="site-container">
          <div
            style={{
              background: "linear-gradient(135deg, #880099, #4d0057)",
              borderRadius: "12px 42px 12px 42px",
              padding: "50px 40px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div style={{ maxWidth: 600 }}>
              <span
                style={{
                  color: "#f3c86b",
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: "uppercase",
                }}
              >
                Đồng hành cùng con
              </span>
              <h2
                style={{
                  color: "#ffffff",
                  fontSize: 28,
                  margin: "10px 0 12px",
                }}
              >
                Đăng ký nhập học cùng Happy Montessori
              </h2>
              <p style={{ margin: 0, color: "#f0dff2", fontSize: 14 }}>
                Ba mẹ gửi thông tin đăng ký nhập học để nhà trường hướng dẫn
                hoàn thiện hồ sơ cho bé.
              </p>
            </div>
            <Link to="/lien-he">
              <Button
                type="primary"
                size="large"
                shape="round"
                style={{
                  background: "#ffffff",
                  color: "#4d0057",
                  borderColor: "#ffffff",
                }}
              >
                Đăng ký nhập học ngay ↗
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
