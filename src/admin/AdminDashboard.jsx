import { useState } from "react";
import AdminDataModal from "./AdminDataModal.jsx";
import AdminSectionContent from "./AdminSectionContent.jsx";
import AdminShell from "./AdminShell.jsx";
import AdminLogin from "./features/auth/AdminLogin.jsx";
import useAdminSession from "./features/auth/useAdminSession.js";
import SubmissionDialogs from "./features/submissions/SubmissionDialogs.jsx";
import useSubmissionManagement from "./features/submissions/useSubmissionManagement.js";
import useAdminData from "./hooks/useAdminData.jsx";
import useAdminResources from "./hooks/useAdminResources.js";
import {
  adminTableScroll,
  dashboardTableScroll,
  formatCurrency,
  previewWords,
} from "./shared/adminUtils.js";

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const session = useAdminSession();
  const data = useAdminData({
    activeMenu,
    setActiveMenu,
    token: session.token,
    adminFetch: session.adminFetch,
  });
  const submissions = useSubmissionManagement({
    adminFetch: session.adminFetch,
    token: session.token,
    setSubmissions: data.setSubmissions,
  });
  const resources = useAdminResources({
    adminFetch: session.adminFetch,
    token: session.token,
    fetchData: data.fetchData,
    teachers: data.teachers,
    setTeachers: data.setTeachers,
    programs: data.programs,
    setPrograms: data.setPrograms,
    posts: data.posts,
    setPosts: data.setPosts,
    testimonials: data.testimonials,
    setTestimonials: data.setTestimonials,
    products: data.products,
    setProducts: data.setProducts,
    promotions: data.promotions,
    setPromotions: data.setPromotions,
    events: data.events,
    setEvents: data.setEvents,
  });

  if (!session.token) {
    return <AdminLogin loading={session.loading} onLogin={session.login} />;
  }

  const viewProps = {
    ...data.viewProps,
    ...submissions.viewProps,
    ...resources.viewProps,
    adminTableScroll,
    dashboardTableScroll,
    previewWords,
    formatCurrency,
  };

  return (
    <AdminShell
      activeMenu={activeMenu}
      stats={data.stats}
      adminUser={session.adminUser}
      onMenuChange={setActiveMenu}
      onLogout={session.logout}
      onOpenModal={resources.openModal}
    >
      <AdminSectionContent {...viewProps} />
      <AdminDataModal {...resources.modalProps} />
      <SubmissionDialogs {...submissions.dialogs} />
    </AdminShell>
  );
}
