import { Col, Row, Typography } from "antd";

const { Title } = Typography;

export default function EducationValuesSection() {
  return (
    <>
      {/* 2. Triết lý giáo dục 3 giá trị */}
      <section className="site-section" style={{ background: "#ffffff" }}>
        <div className="site-container">
          <Row gutter={[32, 24]}>
            <Col xs={24} md={6}>
              <span className="eyebrow-tag">Triết lý cốt lõi</span>
              <Title level={3} style={{ color: "#4d0057", marginTop: 8 }}>
                Nuôi dưỡng những em bé hạnh phúc
              </Title>
            </Col>
            <Col xs={24} md={6}>
              <div
                style={{
                  padding: 20,
                  background: "#fff9ec",
                  borderRadius: 12,
                  border: "1px solid #f4e7c9",
                }}
              >
                <span
                  style={{ fontSize: 24, display: "block", marginBottom: 8 }}
                >
                  💛
                </span>
                <strong
                  style={{
                    display: "block",
                    color: "#4d0057",
                    fontSize: 17,
                    marginBottom: 6,
                  }}
                >
                  Hạnh phúc
                </strong>
                <p style={{ margin: 0, fontSize: 13, color: "#6e7e72" }}>
                  Mỗi bé được lắng nghe, yêu thương và tôn trọng bản sắc tự
                  nhiên.
                </p>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div
                style={{
                  padding: 20,
                  background: "#f7eefa",
                  borderRadius: 12,
                  border: "1px solid #ead8ee",
                }}
              >
                <span
                  style={{ fontSize: 24, display: "block", marginBottom: 8 }}
                >
                  🌱
                </span>
                <strong
                  style={{
                    display: "block",
                    color: "#4d0057",
                    fontSize: 17,
                    marginBottom: 6,
                  }}
                >
                  Trí tuệ
                </strong>
                <p style={{ margin: 0, fontSize: 13, color: "#6e7e72" }}>
                  Khơi mở tư duy chủ động, tìm tòi và tự giải quyết các thử
                  thách.
                </p>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div
                style={{
                  padding: 20,
                  background: "#fff1f7",
                  borderRadius: 12,
                  border: "1px solid #fae1d5",
                }}
              >
                <span
                  style={{ fontSize: 24, display: "block", marginBottom: 8 }}
                >
                  🌸
                </span>
                <strong
                  style={{
                    display: "block",
                    color: "#4d0057",
                    fontSize: 17,
                    marginBottom: 6,
                  }}
                >
                  Nhân ái
                </strong>
                <p style={{ margin: 0, fontSize: 13, color: "#6e7e72" }}>
                  Học cách sẻ chia, đồng cảm và xây dựng tình bạn gắn kết.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
}
