import { useState } from "react";
import { Row, Col, Spin } from "antd";
import { TeacherCard } from "../components/Cards.jsx";
import CardPagination, { getPageItems } from "../components/CardPagination.jsx";

const TEACHER_PAGE_SIZE = 8;

export default function TeachersPage({ teachers = [], loading }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(teachers.length / TEACHER_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleTeachers = getPageItems(
    teachers,
    currentPage,
    TEACHER_PAGE_SIZE,
  );

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  return (
    <div className="site-section">
      <div className="site-container">
        <div className="page-heading">
          <span className="eyebrow-tag">Happy Montessori</span>
          <h1 className="section-title">Đội ngũ Giáo viên Tận tâm & Yêu trẻ</h1>
          <p className="section-desc">
            Đội ngũ giáo viên tại Happy Montessori là những người mẹ thứ hai của
            trẻ — giàu chuyên môn, giàu tình thương và luôn đồng hành cùng sự
            phát triển của từng bé.
          </p>
        </div>
        <Row gutter={[24, 28]}>
          {visibleTeachers.map((t) => (
            <Col xs={12} sm={8} md={6} key={t.id}>
              <TeacherCard teacher={t} />
            </Col>
          ))}
        </Row>
        <CardPagination
          current={currentPage}
          items={teachers}
          onChange={setPage}
          pageSize={TEACHER_PAGE_SIZE}
        />
      </div>
    </div>
  );
}
