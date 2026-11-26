import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, Input, Spin, message } from "antd";
import ImageUploadField from "../../shared/components/ImageUploadField.jsx";
import RichTextEditor from "../../shared/components/RichTextEditor.jsx";
import { updateManagedPage } from "./api.js";

const pageConfig = {
  aboutPage: { title: "Chỉnh sửa trang Giới thiệu" },
  enrollmentPage: { title: "Chỉnh sửa trang Tuyển sinh" },
};

export default function ManagedPageView({ activeMenu, managedPage, adminFetch, token, fetchData }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const config = pageConfig[activeMenu];

  useEffect(() => {
    if (managedPage?.pageKey === activeMenu) {
      form.setFieldsValue({
        title: managedPage.title,
        excerpt: managedPage.excerpt,
        body: managedPage.body,
        featuredImage: managedPage.featuredImage,
      });
    }
  }, [activeMenu, form, managedPage]);

  if (!config) return null;
  if (managedPage?.pageKey === activeMenu && managedPage?.loadError) {
    return <Alert type="error" showIcon message="Không tải được nội dung trang" description={typeof managedPage.loadError === "string" ? managedPage.loadError : "Kiểm tra dữ liệu content_items và tải lại mục quản lý."} />;
  }
  if (managedPage?.pageKey !== activeMenu) {
    return <div style={{ display: "grid", minHeight: 240, placeItems: "center" }}><Spin size="large" /></div>;
  }

  async function savePage(values) {
    setSaving(true);
    try {
      const response = await updateManagedPage(adminFetch, token, activeMenu, values);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Lưu nội dung trang thất bại.");
      message.success("Đã cập nhật nội dung trang.");
      await fetchData();
    } catch (error) {
      if (!error.sessionExpired) message.error(error.message || "Lưu nội dung trang thất bại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="admin-card-table managed-page-card" title={config.title}>
      <Form form={form} layout="vertical" onFinish={savePage}>
        <Form.Item name="title" label="Tiêu đề trang" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="excerpt" label="Mô tả ngắn">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="featuredImage" label="Ảnh đại diện trang">
          <ImageUploadField token={token} apiFetch={adminFetch} />
        </Form.Item>
        <Form.Item name="body" label="Nội dung chi tiết" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
          <RichTextEditor token={token} apiFetch={adminFetch} />
        </Form.Item>
        <div className="managed-page-actions">
          <Button type="primary" htmlType="submit" loading={saving}>Lưu nội dung trang</Button>
        </div>
      </Form>
    </Card>
  );
}
