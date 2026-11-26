import { Link } from "react-router-dom";
import { Tag } from "antd";
import { ArrowRightOutlined, EnvironmentOutlined } from "@ant-design/icons";
import {
  eventStatusLabels,
  formatEventDate,
  getEventStatus,
} from "../events/eventUtils.js";
import { richHtmlToText } from "../../utils/richContent.js";

const statusColors = {
  upcoming: "blue",
  ongoing: "green",
  completed: "default",
  unknown: "default",
};

export default function EventCard({ event }) {
  const status = getEventStatus(event.eventDate || event.date);
  const description = richHtmlToText(
    event.summary || event.excerpt || event.content || event.body || ""
  );

  return (
    <article className="content-item-card event-item-card">
      <div className="card-media">
        <Link to={`/hoat-dong/${event.slug}`} aria-label={`Xem sự kiện ${event.title}`}>
          <img
            src={event.featuredImage || "/media/placeholder.svg"}
            alt={event.title}
            loading="lazy"
            onError={(e) => {
              if (!e.currentTarget.src.endsWith("/media/placeholder.svg")) {
                e.currentTarget.src = "/media/placeholder.svg";
              }
            }}
          />
        </Link>
      </div>
      <div className="card-details">
        <Tag color={statusColors[status]} className="event-status-tag">
          {eventStatusLabels[status]}
        </Tag>
        <h3><Link to={`/hoat-dong/${event.slug}`}>{event.title}</Link></h3>
        <div className="event-card-meta">
          <time dateTime={event.eventDate || event.date || undefined}>
            {formatEventDate(event.eventDate || event.date)}
          </time>
          <span><EnvironmentOutlined /> {event.location || "Chưa cập nhật địa điểm"}</span>
        </div>
        {description && <p>{description}</p>}
        <Link className="event-card-detail" to={`/hoat-dong/${event.slug}`}>
          Xem chi tiết <ArrowRightOutlined />
        </Link>
      </div>
    </article>
  );
}
