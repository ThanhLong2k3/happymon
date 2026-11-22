import { Card, Tag, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function getSizes(product) {
  return String(product.sizes || "")
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);
}

export default function ProductCard({ product }) {
  const sizes = getSizes(product);

  return (
    <Card
      className="store-product-card"
      cover={
        <div className="store-product-image">
          <img
            src={product.imageUrl || "/media/placeholder.svg"}
            alt={product.name}
            loading="lazy"
            onError={(event) => {
              const image = event.currentTarget;
              if (!image.src.endsWith("/media/placeholder.svg")) {
                image.src = "/media/placeholder.svg";
              } else {
                image.style.visibility = "hidden";
              }
            }}
          />
        </div>
      }
    >
      <div className="store-product-content">
        <div className="store-product-tags">
          <Tag color="purple">{product.category || "Đồng phục"}</Tag>
          {!product.inStock && <Tag color="default">Tạm hết hàng</Tag>}
        </div>
        <Title level={4} className="store-product-title">
          {product.name}
        </Title>
        <Paragraph className="store-product-description">
          {product.description || "Sản phẩm đồng phục Happy Montessori."}
        </Paragraph>
        <Text strong className="store-product-price">
          {formatCurrency(product.price)}
        </Text>
        {sizes.length > 0 && (
          <div className="store-product-sizes">
            <Text type="secondary">Kích cỡ:</Text>
            <div>
              {sizes.map((size) => (
                <Tag key={size}>{size}</Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
