import { Button, Card, Col, Form, Input, InputNumber, Row, Typography } from "antd";
import {
  ArrowRightOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export default function EnrollmentForm({
  form,
  loading,
  minEnrollmentDate,
  onSubmit,
}) {
  return (
    <Card className="enrollment-form-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark="optional"
      >
        <Title level={4}>Thông tin phụ huynh</Title>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="parentName"
              label="Họ tên phụ huynh"
              rules={[
                { required: true, message: "Vui lòng nhập họ tên." },
                { min: 2, message: "Họ tên cần có ít nhất 2 ký tự." },
                { max: 100, message: "Họ tên tối đa 100 ký tự." },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="parentPhone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại." },
                {
                  pattern: /^\d{10}$/,
                  message: "Số điện thoại gồm đúng 10 chữ số.",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                placeholder="0961348219"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="parentEmail"
              label="Email phụ huynh"
              rules={[
                { required: true, message: "Vui lòng nhập email phụ huynh." },
                { type: "email", message: "Email không hợp lệ." },
                { max: 255, message: "Email tối đa 255 ký tự." },
              ]}
            >
              <Input
                type="email"
                autoComplete="email"
                placeholder="bame@example.com"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="parentAddress"
              label="Địa chỉ"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ." },
                { min: 5, max: 500, message: "Địa chỉ tối đa 500 ký tự." },
              ]}
            >
              <Input
                autoComplete="street-address"
                placeholder="Quận / huyện, tỉnh / thành phố"
                maxLength={500}
              />
            </Form.Item>
          </Col>
        </Row>

        <Title level={4}>Thông tin của bé</Title>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="childName"
              label="Họ tên của bé"
              rules={[
                { required: true, message: "Vui lòng nhập họ tên của bé." },
                { min: 2, message: "Họ tên cần có ít nhất 2 ký tự." },
                { max: 100, message: "Họ tên tối đa 100 ký tự." },
              ]}
            >
              <Input placeholder="Họ tên của bé" maxLength={100} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="childAgeMonths"
              label="Độ tuổi (tháng)"
              rules={[
                { required: true, message: "Vui lòng nhập độ tuổi của bé." },
                {
                  type: "number",
                  min: 6,
                  max: 72,
                  message: "Độ tuổi cần từ 6 đến 72 tháng.",
                },
              ]}
            >
              <InputNumber
                min={6}
                max={72}
                precision={0}
                style={{ width: "100%" }}
                placeholder="6 - 72 tháng"
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="enrollmentDate"
              label="Ngày nhập học dự kiến"
              rules={[
                {
                  validator: (_, value) =>
                    !value || value >= minEnrollmentDate
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Ngày nhập học phải sau hôm nay."),
                        ),
                },
              ]}
            >
              <Input
                type="date"
                min={minEnrollmentDate}
                aria-label="Ngày nhập học dự kiến (không bắt buộc)"
              />
            </Form.Item>
          </Col>
        </Row>

        <Button
          type="primary"
          htmlType="submit"
          icon={<ArrowRightOutlined />}
          loading={loading}
          block
          size="large"
          shape="round"
        >
          Gửi đăng ký nhập học
        </Button>
      </Form>
    </Card>
  );
}
