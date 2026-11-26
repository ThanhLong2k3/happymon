import { Col, Form, Input, InputNumber, Row } from "antd";
import ImageUploadField from "../../shared/components/ImageUploadField.jsx";
import RichTextEditor from "../../shared/components/RichTextEditor.jsx";

export default function TestimonialFormFields({ modalType, editingItem, token, adminFetch }) {
  return (
    <>
          {modalType === "testimonial" && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="parentName"
                    label="Tên phụ huynh"
                    rules={[{ required: true, message: "Vui lòng nhập tên phụ huynh" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="childName" label="Tên học sinh">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="relationship" label="Mối quan hệ">
                    <Input placeholder="Phụ huynh, Mẹ bé..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="slug"
                    label="Slug"
                    rules={editingItem?.id ? [{ required: true, message: "Vui lòng nhập slug" }] : []}
                  >
                    <Input placeholder="cam-nhan-phu-huynh" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item name="avatarUrl" label="Ảnh đại diện">
                    <ImageUploadField token={token} apiFetch={adminFetch} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="rating" label="Đánh giá">
                    <InputNumber min={1} max={5} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="displayOrder" label="Thứ tự">
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="content"
                label="Nội dung cảm nhận"
                rules={[{ required: true, message: "Vui lòng nhập nội dung cảm nhận" }]}
              >
                <RichTextEditor token={token} apiFetch={adminFetch} />
              </Form.Item>
            </>
          )}
    </>
  );
}
