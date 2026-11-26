import { Link } from "react-router-dom";
import { Tag } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { richHtmlToText } from "../../utils/richContent.js";

export default function ContentCard({ item, label, toPrefix = "/bai-viet" }) {
  const dateStr = item.date || item.publishedAt || item.eventDate;
  const description = richHtmlToText(
    item.excerpt || item.summary || richHtmlToText(item.body || "").slice(0, 140)
  );
  const to =
    item.type === "event"
      ? `/hoat-dong/${item.slug}`
      : `${toPrefix}/${item.slug}`;

  return (
    <div className="content-item-card">
      <div className="card-media">
        <Link to={to}>
          <img
            src={item.featuredImage || "/media/placeholder.svg"}
            alt={item.title}
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
        </Link>
        {label && (
          <Tag
            color="cyan"
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              borderRadius: 12,
            }}
          >
            {label}
          </Tag>
        )}
      </div>
      <div className="card-details">
        {dateStr && <span className="card-date">{dateStr.slice(0, 10)}</span>}
        <h3>
          <Link to={to}>{item.title}</Link>
        </h3>
        <p>
          {description}
        </p>
        <Link
          to={to}
          style={{
            color: "#880099",
            fontWeight: 700,
            fontSize: 13,
            marginTop: "auto",
          }}
        >
          Tìm hiểu thêm <ArrowRightOutlined />
        </Link>
      </div>
    </div>
  );
}
