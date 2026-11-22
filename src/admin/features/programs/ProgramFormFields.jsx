import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import ImageUploadField from "../../shared/components/ImageUploadField.jsx";

const { TextArea } = Input;
export default function ProgramFormFields({ modalType, token, adminFetch }) {
  return (
    <>
          {modalType === "program" && (
            <>
              <Form.Item
                name="title"
                label="Tên chương trình / CLB"
                rules={[{ required: true, message: "Vui lòng nhập tên chương trình" }]}
              >
                <Input placeholder="Ví dụ: Câu lạc bộ Âm nhạc" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={14}>
                  <Form.Item
                    name="slug"
                    label="Slug URL"
                    rules={[{ required: true, message: "Vui lòng nhập slug" }]}
                  >
                    <Input placeholder="cau-lac-bo-am-nhac" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item name="category" label="Phân loại">
                    <Select
                      options={[
                        { value: "montessori", label: "Montessori" },
                        { value: "club", label: "Câu lạc bộ" },
                        { value: "english", label: "Tiếng Anh" },
                        { value: "skill", label: "Kỹ năng" },
                        { value: "nutrition", label: "Dinh dưỡng" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item name="ageGroup" label="Độ tuổi">
                    <Input placeholder="18 tháng - 6 tuổi" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="displayOrder" label="Thứ tự">
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="featuredImage" label="Hình ảnh chương trình">
                <ImageUploadField token={token} apiFetch={adminFetch} />
              </Form.Item>
              <Form.Item name="shortDescription" label="Mô tả ngắn">
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item name="description" label="Mô tả chi tiết">
                <TextArea rows={5} />
              </Form.Item>
            </>
          )}
    </>
  );
}
