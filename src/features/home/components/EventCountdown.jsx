import { useEffect, useState } from "react";
import { Button, Row, Col, Typography, Spin } from "antd";
import { GiftOutlined, ArrowRightOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const getTimeLeft = (end) => {
  const diff = end - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const TIER_COLORS = ["#cf222e", "#e8b94f", "#2b5541", "#1677ff", "#880099"];

export default function EventCountdown() {
  const [promotion, setPromotion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer = null;
    let active = true;

    async function loadPromotion() {
      try {
        const response = await fetch("/api/promotion/homepage");
        if (!response.ok) return;
        const result = await response.json();
        const promo = result?.promotion || result?.data?.[0];

        if (!active || !promo?.endDate) return;

        const end = new Date(promo.endDate).getTime();
        const initialTimeLeft = getTimeLeft(end);
        if (!initialTimeLeft) return;

        setPromotion(promo);
        setTimeLeft(initialTimeLeft);

        timer = setInterval(() => {
          const currentLeft = getTimeLeft(end);
          if (!currentLeft) {
            clearInterval(timer);
            setTimeLeft(null);
          } else {
            setTimeLeft(currentLeft);
          }
        }, 1000);
      } catch (err) {
        console.error("Load promotion countdown failed:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPromotion();

    return () => {
      active = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  if (loading || !promotion || !timeLeft) return null;

  const tiers = [
    { text: promotion.tier1, color: TIER_COLORS[0] },
    { text: promotion.tier2, color: TIER_COLORS[1] },
    { text: promotion.tier3, color: TIER_COLORS[2] },
    { text: promotion.tier4, color: TIER_COLORS[3] },
    { text: promotion.tier5, color: TIER_COLORS[4] },
  ].filter((item) => item.text && item.text.trim());

  return (
    <section
      className="site-section event-countdown-section"
      style={{
        background: "linear-gradient(135deg, #fdf7fc 0%, #faedf9 50%, #f4fbfa 100%)",
        borderTop: "1px solid #ebd3eb",
        borderBottom: "1px solid #ebd3eb",
        padding: "60px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="site-container" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        {/* Badge & Tiêu đề */}
        <div style={{ maxWidth: 780, margin: "0 auto 32px" }}>
          <span
            className="eyebrow-tag"
            style={{
              background: "#880099",
              color: "#ffffff",
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              display: "inline-block",
              marginBottom: 16,
              boxShadow: "0 4px 12px rgba(136, 0, 153, 0.2)",
            }}
          >
            🎁 Ưu đãi Tuyển sinh Đặc biệt
          </span>

          <Title
            level={2}
            style={{
              color: "#4d0057",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              marginBottom: 12,
              lineHeight: 1.3,
            }}
          >
            {promotion.title}
          </Title>

          <Paragraph
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "#5f6f63",
              margin: "0 auto",
            }}
          >
            ⏰ Ba mẹ đừng bỏ lỡ! Áp dụng cho các bé đăng ký sớm trong đợt tuyển sinh này.
          </Paragraph>
        </div>

        {/* Khung đồng hồ đếm ngược */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 36,
          }}
        >
          {[
            { label: "Ngày", value: timeLeft.days },
            { label: "Giờ", value: timeLeft.hours },
            { label: "Phút", value: timeLeft.minutes },
            { label: "Giây", value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                border: "2px solid #880099",
                borderRadius: 16,
                padding: "16px 20px",
                minWidth: 84,
                boxShadow: "0 6px 18px rgba(136, 0, 153, 0.12)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(26px, 3.5vw, 36px)",
                  fontWeight: 800,
                  color: "#880099",
                  lineHeight: 1,
                  fontFamily: "monospace, sans-serif",
                }}
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#6b7c70",
                  marginTop: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div style={{ marginBottom: 44 }}>
          <a href="/lien-he">
            <Button
              type="primary"
              size="large"
              shape="round"
              icon={<ArrowRightOutlined />}
              style={{
                height: 52,
                padding: "0 36px",
                fontSize: 18,
                fontWeight: 700,
                background: "linear-gradient(135deg, #880099 0%, #c71585 100%)",
                borderColor: "#880099",
                boxShadow: "0 8px 24px rgba(136, 0, 153, 0.35)",
              }}
            >
              Đăng ký nhận ưu đãi ngay
            </Button>
          </a>
          <div style={{ marginTop: 10, fontSize: 13, color: "#8a968e" }}>
            <ClockCircleOutlined style={{ marginRight: 6 }} />
            Chỉ còn <strong style={{ color: "#880099" }}>{timeLeft.days} ngày</strong> nữa thôi!
          </div>
        </div>

        {/* Danh sách các gói ưu đãi */}
        {tiers.length > 0 && (
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <Title
              level={4}
              style={{
                color: "#4d0057",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <GiftOutlined style={{ color: "#880099" }} />
              Các gói ưu đãi tuyển sinh bao gồm:
            </Title>

            <Row gutter={[20, 20]} justify="center">
              {tiers.map((tier, idx) => (
                <Col xs={24} sm={12} md={tiers.length >= 4 ? 6 : 8} key={idx}>
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: 16,
                      padding: "20px 18px",
                      border: "1.5px solid #ebd3eb",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                      position: "relative",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "#880099",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(136, 0, 153, 0.3)",
                      }}
                    >
                      {idx + 1}
                    </span>

                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: `${tier.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                      }}
                    >
                      <GiftOutlined style={{ fontSize: 20, color: tier.color }} />
                    </div>

                    <div
                      style={{
                        color: "#29362f",
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {tier.text}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </section>
  );
}
