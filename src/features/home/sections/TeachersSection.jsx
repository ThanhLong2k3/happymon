import { Link } from "react-router-dom";
import { Button } from "antd";
import { TeacherCard } from "../../../components/Cards.jsx";
import HomeCardCarousel from "../components/HomeCardCarousel.jsx";

export default function TeachersSection({ teachers = [] }) {
  return (
    <>
      {/* 4. Đội ngũ Giáo viên */}
      <section className="site-section" style={{ background: "#fbf7fc" }}>
        <div className="site-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 36,
            }}
          >
            <div>
              <span className="eyebrow-tag">Những người gieo mầm</span>
              <h2 className="section-title">
                Đội ngũ Giáo viên Tận tâm & Yêu trẻ
              </h2>
              <p className="section-desc">
                Các cô giáo luôn đồng hành, thấu hiểu và lắng nghe trẻ bằng cả
                trái tim.
              </p>
            </div>
            <Link to="/doi-ngu">
              <Button shape="round">Xem tất cả giáo viên →</Button>
            </Link>
          </div>
          <HomeCardCarousel
            items={teachers}
            className="home-card-track--teachers"
            label="Danh sách giáo viên"
            renderCard={(teacher) => <TeacherCard teacher={teacher} />}
          />
        </div>
      </section>
    </>
  );
}
