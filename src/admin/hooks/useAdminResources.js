import { useState } from "react";
import { Form, message } from "antd";
import * as postsApi from "../features/posts/api.js";
import * as productsApi from "../features/products/api.js";
import * as programsApi from "../features/programs/api.js";
import * as teachersApi from "../features/teachers/api.js";
import * as testimonialsApi from "../features/testimonials/api.js";
import * as promotionsApi from "../features/promotions/api.js";

const saveByType = {
  teacher: teachersApi.saveTeacher,
  post: postsApi.savePost,
  program: programsApi.saveProgram,
  testimonial: testimonialsApi.saveTestimonial,
  product: productsApi.saveProduct,
  promotion: promotionsApi.savePromotion,
};

export default function useAdminResources({
  adminFetch,
  token,
  fetchData,
  teachers,
  setTeachers,
  programs,
  setPrograms,
  posts,
  setPosts,
  testimonials,
  setTestimonials,
  products,
  setProducts,
  promotions,
  setPromotions,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  function openModal(type, item = null) {
    setModalType(type);
    setEditingItem(item);
    setModalVisible(true);
    form.resetFields();

    if (item) {
      form.setFieldsValue(
        type === "product"
          ? {
              ...item,
              price: Number(item.price),
              inStock: Boolean(item.inStock),
            }
          : type === "promotion"
            ? {
                ...item,
                isActive: Boolean(item.isActive),
              }
            : item
      );
      return;
    }

    const initialValuesByType = {
      teacher: { displayOrder: teachers.length + 1 },
      post: { category: "Góc chia sẻ" },
      program: {
        category: "club",
        ageGroup: "18 tháng - 6 tuổi",
        displayOrder: programs.length + 1,
      },
      testimonial: {
        relationship: "Phụ huynh",
        rating: 5,
        displayOrder: testimonials.length + 1,
      },
      product: {
        category: "Đồng phục",
        price: 0,
        sizes: "",
        inStock: true,
      },
      promotion: {
        isActive: true,
        tier1: "Giảm 20% học phí tháng đầu tiên",
        tier2: "Tặng bộ đồng phục và balo Happy",
        tier3: "Miễn 100% phí cơ sở vật chất năm đầu",
      },
    };
    form.setFieldsValue(initialValuesByType[type] || {});
  }

  async function removeResource({
    remove,
    id,
    setItems,
    errorMessage,
    successMessage,
    readErrorResponse = false,
  }) {
    try {
      const response = await remove(adminFetch, token, id);
      const data = readErrorResponse ? await response.json() : null;
      if (!response.ok) {
        throw new Error(data?.error || errorMessage);
      }
      setItems((previous) => previous.filter((item) => item.id !== id));
      message.success(successMessage);
    } catch (error) {
      if (!error.sessionExpired) message.error(error.message);
    }
  }

  const deleteTeacher = (id) =>
    removeResource({
      remove: teachersApi.removeTeacher,
      id,
      setItems: setTeachers,
      errorMessage: "Xóa giáo viên thất bại.",
      successMessage: "Đã xóa giáo viên.",
    });

  const deleteProgram = (id) =>
    removeResource({
      remove: programsApi.removeProgram,
      id,
      setItems: setPrograms,
      errorMessage: "Xóa chương trình thất bại.",
      successMessage: "Đã xóa chương trình.",
    });

  const deletePost = (id) =>
    removeResource({
      remove: postsApi.removePost,
      id,
      setItems: setPosts,
      errorMessage: "Xóa bài viết thất bại.",
      successMessage: "Đã xóa bài viết.",
    });

  const deleteTestimonial = (id) =>
    removeResource({
      remove: testimonialsApi.removeTestimonial,
      id,
      setItems: setTestimonials,
      errorMessage: "Xóa cảm nhận thất bại.",
      successMessage: "Đã xóa cảm nhận.",
    });

  const deleteProduct = (id) =>
    removeResource({
      remove: productsApi.removeProduct,
      id,
      setItems: setProducts,
      errorMessage: "Xóa sản phẩm thất bại.",
      successMessage: "Đã xóa sản phẩm.",
      readErrorResponse: true,
    });

  const deletePromotion = (id) =>
    removeResource({
      remove: promotionsApi.removePromotion,
      id,
      setItems: setPromotions,
      errorMessage: "Xóa chương trình ưu đãi thất bại.",
      successMessage: "Đã xóa chương trình ưu đãi.",
      readErrorResponse: true,
    });

  async function handleModalSubmit(values) {
    try {
      const save = saveByType[modalType];
      if (!save) throw new Error("Không xác định được loại dữ liệu cần lưu.");

      const response = await save(adminFetch, token, editingItem?.id, values);
      if (!response.ok) throw new Error("Lưu thất bại.");

      message.success(editingItem?.id ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setModalVisible(false);
      fetchData();
    } catch (error) {
      if (!error.sessionExpired) message.error(error.message);
    }
  }

  return {
    openModal,
    viewProps: {
      openModal,
      deleteTeacher,
      deleteProgram,
      deletePost,
      deleteTestimonial,
      deleteProduct,
      deletePromotion,
    },
    modalProps: {
      modalType,
      editingItem,
      modalVisible,
      setModalVisible,
      form,
      handleModalSubmit,
      token,
      adminFetch,
    },
  };
}
