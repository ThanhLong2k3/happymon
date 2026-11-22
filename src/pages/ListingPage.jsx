import { useState } from "react";
import { Row, Col, Spin } from "antd";
import { ContentCard } from "../components/Cards.jsx";
import CardPagination, {
  CARD_PAGE_SIZE,
  getPageItems,
} from "../components/CardPagination.jsx";

export default function ListingPage({
  items = [],
  loading,
  types = [],
  title,
  description,
  badgeLabel,
}) {
  const [page, setPage] = useState(1);
  const filtered = items.filter((item) => types.includes(item.type));
  const pageCount = Math.max(1, Math.ceil(filtered.length / CARD_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  const visibleItems = getPageItems(filtered, currentPage);

  return (
    <div className="site-section">
      <div className="site-container">
        <div style={{ maxWidth: 680, marginBottom: 40 }}>
          <span className="eyebrow-tag">Happy Montessori</span>
          <h1 className="section-title">{title}</h1>
          {description && <p className="section-desc">{description}</p>}
        </div>
        <Row gutter={[24, 28]}>
          {visibleItems.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <ContentCard item={item} label={badgeLabel} />
            </Col>
          ))}
        </Row>
        <CardPagination
          current={currentPage}
          items={filtered}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
