import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import ImageUploadField from "../../shared/components/ImageUploadField.jsx";

const { TextArea } = Input;
export default function ProductFormFields({ modalType, token, adminFetch }) {
  return (
    <>
          {modalType === "product" && (
            <>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[
                  { required: true, min: 2, max: 500, message: "Vui lòng nhập tên sản phẩm." },
                ]}
              >
                <Input maxLength={500} placeholder="Áo đồng phục mùa hè" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="slug"
                    label="Slug"
                    rules={[
                      { required: true, pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i, message: "Slug chỉ gồm chữ, số và dấu gạch ngang." },
                    ]}
                  >
                    <Input maxLength={200} placeholder="ao-dong-phuc-mua-he" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="category" label="Danh mục">
                    <Input maxLength={100} placeholder="Đồng phục" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="price"
                    label="Giá (VND)"
                    rules={[{ required: true, type: "number", min: 1, message: "Giá phải lớn hơn 0." }]}
                  >
                    <InputNumber min={1} precision={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="sizes"
                    label="Các size"
                    extra="Phân cách bằng dấu phẩy, ví dụ: 90, 100, 110, 120."
                  >
                    <Input maxLength={255} placeholder="90, 100, 110, 120" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="inStock" label="Tình trạng hàng">
                    <Select
                      options={[
                        { value: true, label: "Còn hàng" },
                        { value: false, label: "Tạm hết hàng" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="imageUrl" label="Ảnh sản phẩm">
                <ImageUploadField token={token} apiFetch={adminFetch} />
              </Form.Item>
              <Form.Item name="description" label="Mô tả sản phẩm">
                <TextArea rows={4} maxLength={10000} />
              </Form.Item>
            </>
          )}
    </>
  );
}
