import { TestimonialCard } from "../../../components/Cards.jsx";
import HomeCardCarousel from "../components/HomeCardCarousel.jsx";

export default function TestimonialsSection({ testimonials = [] }) {
  return (
    <>
      {/* 5. Cảm nhận từ Phụ huynh */}
      <section className="site-section">
        <div className="site-container">
          <div style={{ maxWidth: 780, marginBottom: 40 }}>
            <span className="eyebrow-tag">Góc Phụ Huynh</span>
            <h2 className="section-title">Ba Mẹ Nói Gì Về Happy Montessori?</h2>
            <p className="section-desc">
              Những cảm nhận và lời gửi gắm chân thành từ các gia đình đang gắn
              bó cùng trường.
            </p>
          </div>
          <HomeCardCarousel
            items={testimonials}
            className="home-card-track--testimonials"
            label="Cảm nhận của phụ huynh"
            renderCard={(item) => <TestimonialCard item={item} />}
          />
        </div>
      </section>
    </>
  );
}
