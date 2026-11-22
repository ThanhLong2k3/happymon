import { useParams, Link } from "react-router-dom";
import { Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function ContentPage({ contentItems = [], loading, forcedSlug }) {
  const { slug: routeSlug } = useParams();
  const slug = routeSlug || forcedSlug;
  const item = contentItems.find((entry) => entry.slug === slug);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  if (!item) {
    return (
      <div
        className="site-section"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <Title level={2}>Không tìm thấy nội dung</Title>
        <Paragraph>
          Nội dung này có thể đã được cập nhật đường dẫn mới.
        </Paragraph>
        <Link to="/">
          <Button type="primary">Về trang chủ</Button>
        </Link>
      </div>
    );
  }

  const paragraphs = item.body ? item.body.split(/\n{2,}/).filter(Boolean) : [];

  return (
    <div className="site-section">
      <div className="site-container">
        {routeSlug && (
          <Link
            to={item.type === "event" ? "/hoat-dong" : "/bai-viet"}
            style={{
              display: "block",
              marginBottom: 20,
              color: "#880099",
              fontWeight: 600,
            }}
          >
            <ArrowLeftOutlined /> Quay lại danh sách
          </Link>
        )}
        <span className="eyebrow-tag">
          {item.type === "event" ? "Hoạt động ngoại khóa" : "Happy Montessori"}
        </span>
        <Title
          level={1}
          style={{ color: "#4d0057", marginTop: 8, marginBottom: 16 }}
        >
          {item.title}
        </Title>
        {item.date && (
          <div style={{ color: "#8a968e", fontSize: 13, marginBottom: 24 }}>
            Ngày đăng: {item.date.slice(0, 10)}
          </div>
        )}

        {item.featuredImage && (
          <img
            src={item.featuredImage}
            alt={item.title}
            style={{
              width: "100%",
              maxHeight: 460,
              objectFit: "cover",
              borderRadius: 16,
              marginBottom: 32,
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}

        <div style={{ fontSize: 16, lineHeight: 1.9, color: "#455349" }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: 20 }}>
              {p}
            </p>
          ))}
        </div>

        <div
          style={{
            background: "#faf3fb",
            border: "1px solid #ead8ee",
            borderRadius: 16,
            padding: "28px 32px",
            marginTop: 48,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <strong
              style={{ display: "block", color: "#4d0057", fontSize: 16 }}
            >
              Ba mẹ đang tìm trường cho bé?
            </strong>
            <span style={{ fontSize: 13, color: "#6a7b6f" }}>
              Đăng ký nhập học trực tuyến, nhà trường sẽ hướng dẫn các bước
              hoàn thiện hồ sơ.
            </span>
          </div>
          <Link to="/lien-he">
            <Button type="primary" shape="round">
              Đăng ký nhập học ↗
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
