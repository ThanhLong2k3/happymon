import { Link } from "react-router-dom";
import { Button } from "antd";
import { ContentCard } from "../../../components/Cards.jsx";
import HomeCardCarousel from "../components/HomeCardCarousel.jsx";

export default function PostsSection({ posts = [] }) {
  return (
    <>
      {/* 8. Bài viết & Góc chia sẻ */}
      {posts.length > 0 && (
        <section className="site-section">
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
                <span className="eyebrow-tag">Góc chia sẻ kiến thức</span>
                <h2 className="section-title">
                  Bài Viết & Cẩm Nang Nuôi Dạy Con
                </h2>
                <p className="section-desc">
                  Những kinh nghiệm giáo dục sớm từ các chuyên gia Montessori.
                </p>
              </div>
              <Link to="/bai-viet">
                <Button shape="round">Tất cả bài viết →</Button>
              </Link>
            </div>
            <HomeCardCarousel
              items={posts}
              className="home-card-track--content"
              label="Bài viết và cẩm nang"
              renderCard={(item) => (
                <ContentCard
                  item={item}
                  label={item.category || "Góc chia sẻ"}
                />
              )}
            />
          </div>
        </section>
      )}
    </>
  );
}
