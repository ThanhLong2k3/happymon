import { useParams, Link } from "react-router-dom";
import { Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function ContentPage({
  contentItems = [],
  posts = [],
  events = [],
  programs = [],
  loading,
  forcedSlug,
}) {
  const { slug: routeSlug } = useParams();
  const slug = routeSlug || forcedSlug;
  const sourceItem = contentItems.find((entry) => entry.slug === slug);
  const relatedData = sourceItem?.type === "post"
    ? posts.find((entry) => entry.slug === slug)
    : sourceItem?.type === "event"
      ? events.find((entry) => entry.slug === slug)
      : sourceItem?.type === "course"
        ? programs.find((entry) => entry.slug === slug)
        : null;
  const item = sourceItem
    ? {
        ...relatedData,
        ...sourceItem,
        featuredImage: sourceItem.featuredImage || relatedData?.featuredImage,
        body:
          sourceItem.body || relatedData?.body || relatedData?.content || relatedData?.description,
        date:
          sourceItem.date || relatedData?.date || relatedData?.publishedAt || relatedData?.eventDate,
      }
    : sourceItem;
  const postSource = posts.length > 0
    ? posts
    : contentItems.filter((entry) => entry.type === "post");
  const recentPosts = item?.type === "post"
    ? postSource
        .filter((entry) => entry.slug !== item.slug)
        .sort((a, b) => new Date(b.publishedAt || b.date || 0) - new Date(a.publishedAt || a.date || 0))
        .slice(0, 10)
    : [];

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
      <div className={`site-container content-page-layout${recentPosts.length ? " content-page-layout--with-sidebar" : ""}`}>
        <article className="content-page-article">
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
        </article>
        {recentPosts.length > 0 && (
          <aside className="recent-posts-sidebar" aria-label="Tin tức gần đây">
            <Title level={3}>Tin tức gần đây</Title>
            <ol>
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link to={`/bai-viet/${post.slug}`}>
                    <img
                      src={post.featuredImage || "/media/placeholder.svg"}
                      alt=""
                      loading="lazy"
                    />
                    <span className="recent-posts-sidebar__title">{post.title}</span>
                    {post.date && (
                      <time dateTime={post.date}>
                        {new Date(post.date.replace(" ", "T")).toLocaleDateString("vi-VN")}
                      </time>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>
    </div>
  );
}
