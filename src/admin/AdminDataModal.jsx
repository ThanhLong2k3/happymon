import { Button, Form, Modal } from "antd";
import TeacherFormFields from "./features/teachers/TeacherFormFields.jsx";
import PostFormFields from "./features/posts/PostFormFields.jsx";
import ProgramFormFields from "./features/programs/ProgramFormFields.jsx";
import ProductFormFields from "./features/products/ProductFormFields.jsx";
import TestimonialFormFields from "./features/testimonials/TestimonialFormFields.jsx";
import PromotionFormFields from "./features/promotions/PromotionFormFields.jsx";

const modalTitles = {
  teacher: { create: "Thêm Giáo viên mới", edit: "Chỉnh sửa Giáo viên" },
  post: { create: "Viết bài mới", edit: "Chỉnh sửa Bài viết" },
  program: { create: "Thêm Chương trình / CLB", edit: "Chỉnh sửa Chương trình / CLB" },
  product: { create: "Thêm sản phẩm", edit: "Chỉnh sửa sản phẩm" },
  testimonial: { create: "Thêm Cảm nhận Phụ huynh", edit: "Chỉnh sửa Cảm nhận" },
  promotion: { create: "Tạo Chiến dịch Tuyển sinh & Ưu đãi mới", edit: "Chỉnh sửa Chiến dịch Tuyển sinh & Ưu đãi" },
};

export default function AdminDataModal({
  modalType,
  editingItem,
  modalVisible,
  setModalVisible,
  form,
  handleModalSubmit,
  token,
  adminFetch,
}) {
  const modalTitle = modalTitles[modalType]?.[editingItem?.id ? "edit" : "create"];

  return (
    <Modal
      className="admin-data-modal"
      title={modalTitle}
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      width={680}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleModalSubmit} style={{ marginTop: 16 }}>
          {modalType === "teacher" && <TeacherFormFields modalType={modalType} editingItem={editingItem} token={token} adminFetch={adminFetch} />}
          {modalType === "post" && <PostFormFields modalType={modalType} editingItem={editingItem} token={token} adminFetch={adminFetch} />}
          {modalType === "program" && <ProgramFormFields modalType={modalType} editingItem={editingItem} token={token} adminFetch={adminFetch} />}
          {modalType === "product" && <ProductFormFields modalType={modalType} editingItem={editingItem} token={token} adminFetch={adminFetch} />}
          {modalType === "testimonial" && <TestimonialFormFields modalType={modalType} editingItem={editingItem} token={token} adminFetch={adminFetch} />}
          {modalType === "promotion" && <PromotionFormFields modalType={modalType} editingItem={editingItem} token={token} adminFetch={adminFetch} />}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
          <Button onClick={() => setModalVisible(false)}>Hủy bỏ</Button>
          <Button type="primary" htmlType="submit">Lưu thông tin</Button>
        </div>
      </Form>
    </Modal>
  );
}
