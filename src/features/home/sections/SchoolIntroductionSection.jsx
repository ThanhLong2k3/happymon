import { Link } from "react-router-dom";
import { Button, Col, Row, Space, Typography } from "antd";
import { ArrowRightOutlined, CheckCircleFilled } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function SchoolIntroductionSection() {
  return (
    <>
      {/* 3. Giới thiệu tổng quan & Môi trường */}
      <section className="site-section">
        <div className="site-container">
          <Row gutter={[48, 36]} align="middle">
            <Col xs={24} md={12}>
              <img
                src="/media/2019/11/Co-so-vat-chat.jpg"
                alt="Montessori class"
                style={{
                  width: "100%",
                  borderRadius: "8px 36px 8px 36px",
                  boxShadow: "0 14px 34px rgba(77, 0, 87, 0.1)",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </Col>
            <Col xs={24} md={12}>
              <span className="eyebrow-tag">Không gian chuẩn bị</span>
              <h1 level={2} className="section-title">
                Một môi trường lý tưởng để con tự do khám phá thế giới
              </h1>
              <Paragraph className="section-desc">
                Happy Montessori đồng hành cùng ba mẹ trong những năm đầu đời
                quan trọng nhất. Từ giáo cụ trực quan đến các hoạt động thực
                hành kỹ năng cuộc sống, mỗi ngày tại trường là một hành trình
                thú vị của sự tự lập.
              </Paragraph>
              <Space
                direction="vertical"
                size="middle"
                style={{ margin: "20px 0 24px" }}
              >
                <div>
                  <CheckCircleFilled
                    style={{ color: "#880099", marginRight: 8 }}
                  />{" "}
                  Tôn trọng nhịp độ phát triển của từng cá nhân trẻ
                </div>
                <div>
                  <CheckCircleFilled
                    style={{ color: "#880099", marginRight: 8 }}
                  />{" "}
                  Khuyến khích tính độc lập và tự chăm sóc bản thân
                </div>
                <div>
                  <CheckCircleFilled
                    style={{ color: "#880099", marginRight: 8 }}
                  />{" "}
                  Phát triển ngôn ngữ song ngữ Anh - Việt tự nhiên
                </div>
              </Space>
              <div>
                <Link to="/gioi-thieu">
                  <Button type="primary" shape="round">
                    Tìm hiểu thêm về trường <ArrowRightOutlined />
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
}
