import DashboardView from "./features/dashboard/DashboardView.jsx";
import SubmissionsView from "./features/submissions/SubmissionsView.jsx";
import TeachersView from "./features/teachers/TeachersView.jsx";
import ProgramsView from "./features/programs/ProgramsView.jsx";
import PostsView from "./features/posts/PostsView.jsx";
import ProductsView from "./features/products/ProductsView.jsx";
import TestimonialsView from "./features/testimonials/TestimonialsView.jsx";
import PromotionsView from "./features/promotions/PromotionsView.jsx";

export default function AdminSectionContent(props) {
  return (
    <>
      <DashboardView {...props} />
      <SubmissionsView {...props} />
      <PromotionsView {...props} />
      <TeachersView {...props} />
      <ProgramsView {...props} />
      <PostsView {...props} />
      <ProductsView {...props} />
      <TestimonialsView {...props} />
    </>
  );
}
