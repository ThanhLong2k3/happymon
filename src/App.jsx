import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { antdThemeConfig } from "./theme.js";

// Layout & Global Components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import FloatingCallButton from "./components/FloatingCallButton.jsx";

// Pages
import {
  HomePage,
  TeachersPage,
  TestimonialsPage,
  ListingPage,
  ContentPage,
  ProgramPage,
  ContactPage,
  StorePage,
} from "./pages/index.js";
import AdminDashboard from "./AdminDashboard.jsx";

function useAppData() {
  const [data, setData] = useState({
    teachers: [],
    programs: [],
    testimonials: [],
    events: [],
    posts: [],
    contentItems: [],
    loading: true,
  });

  useEffect(() => {
    let active = true;
    fetch("/api/initial-data")
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!active || !payload) return;
        setData({
          teachers: payload.teachers || [],
          programs: payload.programs || [],
          testimonials: payload.testimonials || [],
          events: payload.events || [],
          posts: payload.posts || [],
          contentItems: payload.contentItems || [],
          loading: false,
        });
      })
      .catch((err) => {
        console.error("Load app data error:", err);
        if (active) setData((prev) => ({ ...prev, loading: false }));
      });

    return () => {
      active = false;
    };
  }, []);

  return data;
}

export default function App() {
  const appData = useAppData();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      document.title = "Cổng Quản Trị — Happy Montessori";
    } else {
      document.title =
        "Trường Mầm non Happy Montessori — Hạnh phúc · Trí tuệ · Nhân ái";
    }
  }, [isAdmin]);

  return (
    <ConfigProvider theme={antdThemeConfig} locale={viVN}>
      {isAdmin ? (
        <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      ) : (
        <div className="site-wrapper">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage {...appData} />} />
              <Route
                path="/doi-ngu"
                element={
                  <TeachersPage
                    teachers={appData.teachers}
                    loading={appData.loading}
                  />
                }
              />
              <Route
                path="/doi-ngu-giao-vien"
                element={
                  <TeachersPage
                    teachers={appData.teachers}
                    loading={appData.loading}
                  />
                }
              />
              <Route
                path="/cam-nhan"
                element={
                  <TestimonialsPage
                    testimonials={appData.testimonials}
                    loading={appData.loading}
                  />
                }
              />
              <Route
                path="/chuong-trinh"
                element={
                  <ProgramPage
                    contentItems={appData.contentItems}
                    loading={appData.loading}
                  />
                }
              />
              <Route
                path="/chuong-trinh-hoc"
                element={
                  <ProgramPage
                    contentItems={appData.contentItems}
                    loading={appData.loading}
                  />
                }
              />
              <Route
                path="/hoat-dong"
                element={
                  <ListingPage
                    items={appData.contentItems}
                    loading={appData.loading}
                    types={["event"]}
                    title="Hoạt động ngoại khóa của bé"
                    description="Những khoảnh khắc học tập, vui chơi và trải nghiệm bổ ích tại trường Happy Montessori."
                    badgeLabel="Hoạt động"
                  />
                }
              />
              <Route
                path="/bai-viet"
                element={
                  <ListingPage
                    items={appData.contentItems}
                    loading={appData.loading}
                    types={["post"]}
                    title="Góc chia sẻ & Tin tức"
                    description="Những bài viết chia sẻ kiến thức nuôi dạy con, phương pháp giáo dục sớm và thông tin sự kiện."
                    badgeLabel="Góc chia sẻ"
                  />
                }
              />
              <Route
                path="/gioi-thieu"
                element={
                  <ContentPage
                    contentItems={appData.contentItems}
                    loading={appData.loading}
                    forcedSlug="gioi-thieu-ve-mam-non-happy-montessori"
                  />
                }
              />
              <Route
                path="/tuyen-sinh"
                element={
                  <ContentPage
                    contentItems={appData.contentItems}
                    loading={appData.loading}
                    forcedSlug="thong-bao-tuyen-sinh"
                  />
                }
              />
              <Route path="/lien-he" element={<ContactPage />} />
              <Route path="/cua-hang" element={<StorePage />} />
              <Route
                path="/bai-viet/:slug"
                element={
                  <ContentPage
                    contentItems={appData.contentItems}
                    loading={appData.loading}
                  />
                }
              />
              <Route
                path="/hoat-dong/:slug"
                element={
                  <ContentPage
                    contentItems={appData.contentItems}
                    loading={appData.loading}
                  />
                }
              />
              <Route
                path="/:slug"
                element={
                  <ContentPage
                    contentItems={appData.contentItems}
                    loading={appData.loading}
                  />
                }
              />
            </Routes>
          </main>
          <Footer />
          <FloatingCallButton />
        </div>
      )}
    </ConfigProvider>
  );
}
