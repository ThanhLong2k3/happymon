import { Avatar, Rate } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function TestimonialCard({ item }) {
  return (
    <div className="testimonial-item-card">
      <div className="author-row">
        <Avatar
          size={90}
          src={item.avatarUrl || item.featuredImage}
          icon={<UserOutlined />}
          className="author-avatar"
        />
        <div>
          <h4>{item.parentName || item.title}</h4>
          <span>
            {item.childName
              ? `Phụ huynh ${item.childName}`
              : item.relationship || "Phụ huynh học sinh"}
          </span>
        </div>
      </div>
      <Rate
        disabled
        defaultValue={item.rating || 5}
        style={{ fontSize: 14, color: "#e5bd61", marginBottom: 12 }}
      />
      <blockquote>"{item.content || item.body || item.excerpt}"</blockquote>
    </div>
  );
}
