import { Form, Input } from "antd";
import ImageUploadField from "../../shared/components/ImageUploadField.jsx";
import RichTextEditor from "../../shared/components/RichTextEditor.jsx";

export default function EventFormFields({ token, adminFetch }) {
  return (
    <>
      <Form.Item name="title" label="Tên sự kiện" rules={[{ required: true, message: "Vui lòng nhập tên sự kiện" }]}>
        <Input placeholder="Tên sự kiện" />
      </Form.Item>
      <Form.Item name="slug" label="Slug URL" rules={[{ required: true, message: "Vui lòng nhập slug" }]}>
        <Input placeholder="ten-su-kien" />
      </Form.Item>
      <Form.Item name="eventDate" label="Thời gian tổ chức" rules={[{ required: true, message: "Vui lòng chọn thời gian tổ chức" }]}>
        <Input type="datetime-local" />
      </Form.Item>
      <Form.Item name="location" label="Địa điểm" rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}>
        <Input placeholder="Địa điểm tổ chức" />
      </Form.Item>
      <Form.Item name="summary" label="Mô tả sự kiện">
        <RichTextEditor token={token} apiFetch={adminFetch} />
      </Form.Item>
      <Form.Item name="content" label="Nội dung chi tiết">
        <RichTextEditor token={token} apiFetch={adminFetch} />
      </Form.Item>
      <Form.Item name="featuredImage" label="Ảnh sự kiện">
        <ImageUploadField token={token} apiFetch={adminFetch} />
      </Form.Item>
    </>
  );
}
