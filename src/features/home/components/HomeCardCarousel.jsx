import { useEffect, useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function getScrollStep(track) {
  const firstCard = track.firstElementChild;
  const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
  return firstCard
    ? firstCard.getBoundingClientRect().width + gap
    : track.clientWidth * 0.8;
}

export default function HomeCardCarousel({
  items,
  className,
  label,
  renderCard,
}) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      const track = trackRef.current;
      if (!track || pausedRef.current) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;

      const nextScroll =
        track.scrollLeft >= maxScroll - 2
          ? 0
          : Math.min(maxScroll, track.scrollLeft + getScrollStep(track));
      track.scrollTo({ left: nextScroll, behavior: "smooth" });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const nextScroll = Math.max(
      0,
      Math.min(maxScroll, track.scrollLeft + direction * getScrollStep(track)),
    );
    track.scrollTo({ left: nextScroll, behavior: "smooth" });
  };

  return (
    <div
      className="home-carousel"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          pausedRef.current = false;
        }
      }}
      onTouchStart={() => {
        pausedRef.current = true;
      }}
      onTouchEnd={() => {
        pausedRef.current = false;
      }}
    >
      {items.length > 1 && (
        <>
          <button
            type="button"
            className="home-carousel-arrow home-carousel-arrow--previous"
            aria-label={`Cuộn ${label} sang trái`}
            onClick={() => scroll(-1)}
          >
            <LeftOutlined />
          </button>
          <button
            type="button"
            className="home-carousel-arrow home-carousel-arrow--next"
            aria-label={`Cuộn ${label} sang phải`}
            onClick={() => scroll(1)}
          >
            <RightOutlined />
          </button>
        </>
      )}
      <div
        ref={trackRef}
        className={`home-card-track ${className}`}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {items.map((item) => (
          <div className="home-card-track-item" key={item.id}>
            {renderCard(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
