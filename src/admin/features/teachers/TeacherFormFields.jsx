import { Col, Form, Input, InputNumber, Row } from "antd";
import ImageUploadField from "../../shared/components/ImageUploadField.jsx";

const { TextArea } = Input;
export default function TeacherFormFields({ modalType, token, adminFetch }) {
  return (
    <>
          {modalType === "teacher" && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                    <Input placeholder="Ví dụ: Cô Nguyễn Thị Huyền" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="slug" label="Slug (đường dẫn)" rules={[{ required: true, message: "Vui lòng nhập slug" }]}>
                    <Input placeholder="co-nguyen-thi-huyen" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="roleTitle" label="Chức danh">
                    <Input placeholder="Giáo viên Montessori" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="className" label="Lớp phụ trách">
                    <Input placeholder="Newton 3, Teresa..." />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={18}>
                  <Form.Item name="avatarUrl" label="Ảnh đại diện">
                    <ImageUploadField token={token} apiFetch={adminFetch} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="displayOrder" label="Thứ tự">
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="bio" label="Tiểu sử / Quá trình công tác">
                <TextArea rows={3} placeholder="Mô tả quá trình đào tạo và kinh nghiệm..." />
              </Form.Item>
            </>
          )}
    </>
  );
}
