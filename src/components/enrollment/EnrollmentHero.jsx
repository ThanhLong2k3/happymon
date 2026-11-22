import { Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function EnrollmentHero() {
  return (
    <div className="enrollment-photo">
      <img
        src="/image_slide/Slide3.jpg"
        alt="Môi trường học tập Happy Montessori"
      />
      <div className="enrollment-photo-copy">
        <CalendarOutlined />
        <Title level={3}>Bắt đầu hành trình nhập học</Title>
        <Text>
          Gửi thông tin đăng ký nhập học để nhà trường tiếp nhận hồ sơ và
          hướng dẫn các bước tiếp theo.
        </Text>
      </div>
    </div>
  );
}
