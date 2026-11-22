import { useEffect, useState } from "react";
import { Alert, Card, Col, Empty, Row, Spin, Typography, message } from "antd";
import { ProductCard } from "../components/cards/index.js";

const { Paragraph, Title } = Typography;

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/products")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Không thể tải danh sách sản phẩm.");
        }
        return result;
      })
      .then((result) => {
        if (active) setProducts(result);
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(error.message || "Không thể tải danh sách sản phẩm.");
        message.error(error.message || "Không thể tải danh sách sản phẩm.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="store-page site-section">
      <div className="site-container">
        <div className="store-page-heading">
          <span className="eyebrow-tag">Cửa hàng Happy Montessori</span>
          <Title className="section-title">Đồng phục & phụ kiện</Title>
          <Paragraph className="section-desc centered-copy">
            Các sản phẩm đồng phục và phụ kiện của trường.
          </Paragraph>
        </div>

        {loadError && (
          <Alert
            type="error"
            showIcon
            message="Không tải được sản phẩm"
            description={loadError}
            style={{ marginBottom: 24 }}
          />
        )}

        {loading ? (
          <div className="store-loading">
            <Spin size="large" />
          </div>
        ) : products.length ? (
          <Row gutter={[24, 24]}>
            {products.map((product) => (
              <Col xs={24} sm={12} lg={8} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="store-empty-card">
            <Empty description="Nhà trường đang cập nhật danh mục sản phẩm." />
          </Card>
        )}
      </div>
    </div>
  );
}
