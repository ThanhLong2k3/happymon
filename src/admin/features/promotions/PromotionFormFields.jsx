import { Col, Form, Input, Row, Switch, Typography } from "antd";
import { GiftOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function PromotionFormFields({ modalType }) {
  if (modalType !== "promotion") return null;

  return (
    <>
      <Form.Item
        name="title"
        label="Tiêu đề chiến dịch tuyển sinh"
        rules={[{ required: true, message: "Vui lòng nhập tiêu đề chiến dịch" }]}
      >
        <Input placeholder="Ví dụ: Ưu đãi Tuyển sinh Năm học mới — Happy Montessori" />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="startDate"
            label="Thời gian bắt đầu"
          >
            <Input type="datetime-local" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="endDate"
            label="Thời gian kết thúc (Đếm ngược)"
            rules={[{ required: true, message: "Vui lòng chọn thời gian kết thúc" }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="isActive"
        label="Trạng thái hiển thị đếm ngược trên trang chủ"
        valuePropName="checked"
      >
        <Switch checkedChildren="Đang hiển thị" unCheckedChildren="Tạm ẩn" />
      </Form.Item>

      <div style={{ margin: "20px 0 12px", borderTop: "1px dashed #d9d9d9", paddingTop: 16 }}>
        <Text strong style={{ color: "#880099", display: "block", marginBottom: 12 }}>
          <GiftOutlined /> Danh sách các gói quà tặng & Ưu đãi đặc biệt:
        </Text>
      </div>

      <Form.Item
        name="tier1"
        label="Ưu đãi 1"
      >
        <Input placeholder="Ví dụ: Giảm 20% học phí tháng đầu tiên" />
      </Form.Item>

      <Form.Item
        name="tier2"
        label="Ưu đãi 2"
      >
        <Input placeholder="Ví dụ: Tặng trọn bộ đồng phục và balo Happy Montessori" />
      </Form.Item>

      <Form.Item
        name="tier3"
        label="Ưu đãi 3"
      >
        <Input placeholder="Ví dụ: Miễn 100% phí cơ sở vật chất năm đầu" />
      </Form.Item>

      <Form.Item
        name="tier4"
        label="Ưu đãi 4"
      >
        <Input placeholder="Ví dụ: Tặng khóa học ngoại khóa nghệ thuật / bơi lội" />
      </Form.Item>

      <Form.Item
        name="tier5"
        label="Ưu đãi 5"
      >
        <Input placeholder="Ví dụ: Giảm thêm 10% khi đăng ký nhóm từ 2 bé trở lên" />
      </Form.Item>
    </>
  );
}
