import { Row, Col } from "antd";
import { ContentCard } from "../components/Cards.jsx";
import ContentPage from "./ContentPage.jsx";

export default function ProgramPage({ contentItems = [], programs = [], loading }) {
  const courses = contentItems
    .filter((item) => item.type === "course")
    .map((course) => {
      const program = programs.find((entry) => entry.slug === course.slug);
      return {
        ...program,
        ...course,
        featuredImage: course.featuredImage || program?.featuredImage,
      };
    });
  return (
    <>
      <ContentPage
        contentItems={contentItems}
        programs={programs}
        loading={loading}
        forcedSlug="chuong-trinh-montessori"
      />
      {courses.length > 0 && (
        <section className="site-section" style={{ background: "#f8fbf8" }}>
          <div className="site-container">
            <div style={{ maxWidth: 640, marginBottom: 36 }}>
              <span className="eyebrow-tag">Năng khiếu & Kỹ năng</span>
              <h2 className="section-title">
                Các Câu Lạc Bộ Năng Khiếu Cho Bé
              </h2>
              <p className="section-desc">
                Phát triển thẩm âm, năng khiếu nghệ thuật, võ thuật và phản xạ
                thể chất.
              </p>
            </div>
            <Row gutter={[24, 28]}>
              {courses.map((item) => (
                <Col xs={24} sm={12} md={8} key={item.id}>
                  <ContentCard item={item} label="Câu lạc bộ" />
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}
    </>
  );
}
