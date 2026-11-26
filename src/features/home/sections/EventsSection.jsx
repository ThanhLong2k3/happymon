import { Link } from "react-router-dom";
import { Button } from "antd";
import EventCard from "../../../components/cards/EventCard.jsx";
import HomeCardCarousel from "../components/HomeCardCarousel.jsx";

export default function EventsSection({ events = [] }) {
  if (!events.length) return null;

  return (
    <section className="site-section" style={{ background: "#ffffff" }}>
      <div className="site-container">
        <div className="events-section-heading">
          <div>
            <span className="eyebrow-tag">Happy Montessori</span>
            <h2 className="section-title">Sự kiện tại Happy Montessori</h2>
            <p className="section-desc">
              Thời gian, địa điểm và thông tin mới nhất về các sự kiện của trường.
            </p>
          </div>
          <Link to="/hoat-dong">
            <Button shape="round">Xem tất cả sự kiện →</Button>
          </Link>
        </div>
        <HomeCardCarousel
          items={events}
          className="home-card-track--events"
          label="Sự kiện"
          renderCard={(event) => <EventCard event={event} />}
        />
      </div>
    </section>
  );
}
