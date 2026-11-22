import { Tag } from "antd";

export default function TeacherCard({ teacher }) {
  return (
    <div className="teacher-item-card">
      <div className="teacher-img-wrap">
        <img
          src={
            teacher.avatarUrl ||
            teacher.featuredImage ||
            "/media/placeholder.svg"
          }
          alt={teacher.name || teacher.title}
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
        {teacher.className && (
          <Tag color="success" className="teacher-badge">
            {teacher.className}
          </Tag>
        )}
      </div>
      <div className="teacher-meta">
        <h3>{teacher.name || teacher.title}</h3>
        <p className="centered-copy">
          {teacher.roleTitle || "Giáo viên Montessori"}
        </p>
      </div>
    </div>
  );
}
