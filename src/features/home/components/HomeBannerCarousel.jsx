import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Space } from "antd";
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

const slides = [
  { image: "/image_slide/Slide1.jpg", title: "Hạnh phúc là ưu tiên hàng đầu" },
  { image: "/image_slide/Slide2.jpg", title: "Phát triển toàn diện" },
  { image: "/image_slide/Slide3.jpg", title: "Giáo dục Montessori" },
  { image: "/image_slide/Slide4.jpg", title: "Khơi nguồn sáng tạo" },
  { image: "/image_slide/Slide5.png", title: "Gắn kết cộng đồng" },
  { image: "/image_slide/Slide6.jpg", title: "Học qua trải nghiệm" },
];

export default function HomeBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (
      isPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const goToSlide = (index) => setCurrentSlide(index);
  const showPrevious = () =>
    setCurrentSlide((current) => (current - 1 + slides.length) % slides.length);
  const showNext = () =>
    setCurrentSlide((current) => (current + 1) % slides.length);

  return (
    <section
      className="hero-wrapper home-hero-carousel"
      aria-label="Ảnh nổi bật Happy Montessori"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="hero-slides" aria-live="polite">
        {slides.map((slide, index) => (
          <div
            className={`hero-slide${index === currentSlide ? " hero-slide--active" : ""}`}
            key={slide.image}
            aria-hidden={index !== currentSlide}
          >
            <img className="hero-background" src={slide.image} alt="" />
          </div>
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="site-container hero-content">
        <div className="hero-copy">
          <span className="eyebrow-tag">Trường Mầm non Happy Montessori</span>
          <h1 className="hero-heading">
            Nơi tuổi thơ
            <br />
            nở hoa <em>hạnh phúc</em>
          </h1>
          <p className="hero-lead">
            Tôn trọng sự khác biệt, nuôi dưỡng tính tự lập và khơi mở tình yêu
            học hỏi trong mỗi em bé theo phương pháp giáo dục Montessori chuẩn
            mực.
          </p>
          <div className="hero-buttons">
            <Link to="/lien-he">
              <Button type="primary" size="large" shape="round">
                Đăng ký nhập học <ArrowRightOutlined />
              </Button>
            </Link>
            <Link to="/chuong-trinh">
              <Button size="large" shape="round">
                Khám phá chương trình
              </Button>
            </Link>
          </div>
          <Space size="large" className="hero-values">
            <span>✳ Hạnh phúc</span>
            <span>✳ Trí tuệ</span>
            <span>✳ Nhân ái</span>
          </Space>
        </div>
      </div>

      <button
        type="button"
        className="hero-slider-arrow hero-slider-arrow--previous"
        aria-label="Ảnh trước"
        onClick={showPrevious}
      >
        <LeftOutlined />
      </button>
      <button
        type="button"
        className="hero-slider-arrow hero-slider-arrow--next"
        aria-label="Ảnh tiếp theo"
        onClick={showNext}
      >
        <RightOutlined />
      </button>

      <div className="hero-slide-counter" aria-live="off">
        {currentSlide + 1} / {slides.length}
      </div>
      <div className="hero-slider-dots" aria-label="Chọn ảnh nổi bật">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            className={index === currentSlide ? "is-active" : ""}
            aria-label={`Ảnh ${index + 1}: ${slide.title}`}
            aria-current={index === currentSlide ? "true" : undefined}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
      <div className="hero-scroll-cue">
        Khám phá Happy Montessori <span>↓</span>
      </div>
    </section>
  );
}
