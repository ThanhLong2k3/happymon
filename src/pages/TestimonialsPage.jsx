import { useState } from "react";
import { Row, Col, Spin } from "antd";
import { TestimonialCard } from "../components/Cards.jsx";
import CardPagination, {
  CARD_PAGE_SIZE,
  getPageItems,
} from "../components/CardPagination.jsx";

export default function TestimonialsPage({ testimonials = [], loading }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(
    1,
    Math.ceil(testimonials.length / CARD_PAGE_SIZE),
  );
  const currentPage = Math.min(page, pageCount);
  const visibleTestimonials = getPageItems(testimonials, currentPage);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  return (
    <div className="site-section">
      <div className="site-container">
        <div className="page-heading">
          <span className="eyebrow-tag">Chia sẻ chân thành</span>
          <h1 className="section-title">Cảm nhận từ các Gia đình Phụ huynh</h1>
          <p className="section-desc">
            Sự tin tưởng và an tâm của ba mẹ chính là động lực to lớn nhất để
            Happy Montessori không ngừng nỗ lực kiến tạo một ngôi trường hạnh
            phúc.
          </p>
        </div>
        <Row gutter={[24, 28]}>
          {visibleTestimonials.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <TestimonialCard item={item} />
            </Col>
          ))}
        </Row>
        <CardPagination
          current={currentPage}
          items={testimonials}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
