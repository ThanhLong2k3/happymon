import { Col, Form, Input, Row, Select } from "antd";
import ImageUploadField from "../../shared/components/ImageUploadField.jsx";
import RichTextEditor from "../../shared/components/RichTextEditor.jsx";

const { TextArea } = Input;
export default function PostFormFields({ modalType, token, adminFetch }) {
  return (
    <>
          {modalType === "post" && (
            <>
              <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
                <Input placeholder="Tiêu đề tin tức..." />
              </Form.Item>
              <Row gutter={16}>
                <Col span={14}>
                  <Form.Item name="slug" label="Slug URL" rules={[{ required: true, message: "Vui lòng nhập slug" }]}>
                    <Input placeholder="tieu-de-bai-viet" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item name="category" label="Chuyên mục">
                    <Select
                      options={[
                        { value: "Góc chia sẻ", label: "Góc chia sẻ" },
                        { value: "Tin tức & sự kiện", label: "Tin tức & sự kiện" },
                        { value: "Quỹ học bổng", label: "Quỹ học bổng" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="featuredImage" label="Hình ảnh nổi bật">
                <ImageUploadField token={token} apiFetch={adminFetch} />
              </Form.Item>
              <Form.Item name="excerpt" label="Tóm tắt ngắn (Excerpt)">
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item name="body" label="Nội dung chi tiết" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
                <RichTextEditor token={token} apiFetch={adminFetch} />
              </Form.Item>
            </>
          )}
    </>
  );
}
