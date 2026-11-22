import { Link } from "react-router-dom";
import { Button } from "antd";
import { ContentCard } from "../../../components/Cards.jsx";
import HomeCardCarousel from "../components/HomeCardCarousel.jsx";

export default function EventsSection({ events = [] }) {
  return (
    <>
      {/* 6. Sự kiện & Hoạt động của bé */}
      {events.length > 0 && (
        <section className="site-section" style={{ background: "#ffffff" }}>
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
                <span className="eyebrow-tag">Khoảnh khắc đáng nhớ</span>
                <h2 className="section-title">
                  Hoạt Động Ngoại Khóa & Sự Kiện
                </h2>
                <p className="section-desc">
                  Những ngày hội, lễ hội và trải nghiệm thực tế tràn đầy tiếng
                  cười của các con.
                </p>
              </div>
              <Link to="/hoat-dong">
                <Button shape="round">Xem tất cả hoạt động →</Button>
              </Link>
            </div>
            <HomeCardCarousel
              items={events}
              className="home-card-track--content"
              label="Hoạt động và sự kiện"
              renderCard={(item) => <ContentCard item={item} label="Sự kiện" />}
            />
          </div>
        </section>
      )}
    </>
  );
}
