import { useState } from "react";
import { Form, Upload, message } from "antd";

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function useEnrollmentRegistration() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState("paid");
  const [paymentFileList, setPaymentFileList] = useState([]);
  const [registration, setRegistration] = useState(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minEnrollmentDate = getDateString(tomorrow);

  async function submitRegistration(values) {
    setLoading(true);
    try {
      const response = await fetch("/api/registration/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Không thể gửi đăng ký.");
      }

      setRegistration({
        id: result.id,
        paymentToken: result.paymentToken,
        parentName: values.parentName,
        parentPhone: values.parentPhone,
      });
      setPaymentChoice("paid");
      setPaymentFileList([]);
      if (result.emailNotificationsSent) {
        message.success("Đã gửi đăng ký và email xác nhận cho ba mẹ.");
      } else {
        message.warning(
          "Đã lưu đăng ký, nhưng chưa gửi được email thông báo. Nhà trường cần kiểm tra cấu hình email.",
          8,
        );
      }
    } catch (error) {
      message.error(
        error instanceof TypeError
          ? "Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại."
          : error.message || "Không thể gửi đăng ký.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function confirmPayment(choice = paymentChoice) {
    if (!registration) return;

    const selectedFile = paymentFileList[0]?.originFileObj;
    if (choice === "paid" && !selectedFile) {
      message.error("Vui lòng tải ảnh biên nhận chuyển khoản.");
      return;
    }

    setPaymentLoading(true);
    try {
      const isProofUpload = choice === "paid";
      const response = await fetch(
        isProofUpload
          ? `/api/registration/${registration.id}/payment-proof`
          : `/api/registration/${registration.id}/payment`,
        {
          method: "POST",
          headers: isProofUpload
            ? {
                Authorization: `Bearer ${registration.paymentToken}`,
                "Content-Type": selectedFile.type,
              }
            : {
                Authorization: `Bearer ${registration.paymentToken}`,
                "Content-Type": "application/json",
              },
          body: isProofUpload
            ? selectedFile
            : JSON.stringify({ status: "later" }),
        },
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Không thể lưu thông tin thanh toán.");
      }

      message.success(
        choice === "paid"
          ? "Đã gửi biên nhận. Nhà trường sẽ xác nhận sau."
          : "Đã lưu đăng ký. Ba mẹ có thể nộp phí giữ chỗ sau.",
      );
      setRegistration(null);
      setPaymentFileList([]);
      form.resetFields();
    } catch (error) {
      message.error(
        error instanceof TypeError
          ? "Không thể kết nối máy chủ. Hồ sơ vẫn được lưu; vui lòng thử lại."
          : error.message || "Không thể lưu thông tin thanh toán.",
      );
    } finally {
      setPaymentLoading(false);
    }
  }

  function validatePaymentImage(file) {
    if (!IMAGE_TYPES.includes(file.type)) {
      message.error("Chỉ hỗ trợ ảnh JPG, PNG, WebP hoặc GIF.");
      return Upload.LIST_IGNORE;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      message.error("Ảnh biên nhận không được vượt quá 5 MB.");
      return Upload.LIST_IGNORE;
    }
    return false;
  }

  return {
    form,
    loading,
    paymentLoading,
    paymentChoice,
    setPaymentChoice,
    paymentFileList,
    setPaymentFileList,
    registration,
    minEnrollmentDate,
    submitRegistration,
    confirmPayment,
    validatePaymentImage,
  };
}
