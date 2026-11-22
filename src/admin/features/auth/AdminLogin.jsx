import { Button, Card, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Text, Title } = Typography;

export default function AdminLogin({ loading, onLogin }) {
  const [form] = Form.useForm();

  return (
    <div className="admin-login-screen">
      <Card className="login-card">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 40, color: "#e5bd61" }}>🌱</span>
          <Title level={3} style={{ color: "#203e30", margin: "8px 0 4px" }}>
            Happy Montessori
          </Title>
          <Text type="secondary">Cổng Quản Trị & Vận Hành Dữ Liệu</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onLogin}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input
              autoComplete="username"
              prefix={<UserOutlined style={{ color: "#8a968e" }} />}
              placeholder="Nhập tên đăng nhập"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              autoComplete="current-password"
              prefix={<LockOutlined style={{ color: "#8a968e" }} />}
              placeholder="Nhập mật khẩu"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            shape="round"
            style={{ marginTop: 12 }}
          >
            Đăng nhập Quản Trị
          </Button>
        </Form>

        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #f0f0f0",
            textAlign: "center",
          }}
        >
          <Text
            type="secondary"
            style={{ fontSize: 13, display: "block", marginBottom: 12 }}
          >
            Chỉ dành cho nhân sự được cấp quyền quản trị.
          </Text>
          <Link to="/" style={{ color: "#34664e", fontWeight: 600, fontSize: 14 }}>
            ← Quay lại Website
          </Link>
        </div>
      </Card>
    </div>
  );
}
