import { Card, Col, Row, Statistic, Typography } from "antd";
import {
  ClockCircleOutlined,
  FileTextOutlined,
  ReadOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const statCards = [
  {
    title: "ĐƠN ĐĂNG KÝ MỚI",
    value: (stats) => stats?.newSubmissions ?? 0,
    note: (stats) => `Tổng số: ${stats?.totalSubmissions ?? 0} đơn`,
    icon: ClockCircleOutlined,
    tone: "blue",
  },
  {
    title: "GIÁO VIÊN & BGH",
    value: (stats) => stats?.totalTeachers ?? 12,
    note: () => "Đang giảng dạy",
    icon: TeamOutlined,
    tone: "yellow",
  },
  {
    title: "CHƯƠNG TRÌNH & CLB",
    value: (stats) => stats?.totalPrograms ?? 7,
    note: () => "Môn học & Ngoại khóa",
    icon: ReadOutlined,
    tone: "green",
  },
  {
    title: "BÀI VIẾT & CHUYÊN ĐỀ",
    value: (stats) => stats?.totalPosts ?? 45,
    note: () => "Tin tức & Chia sẻ",
    icon: FileTextOutlined,
    tone: "purple",
  },
];

export default function DashboardStatsRow({ stats }) {
  return (
    <Row className="admin-stats-row" gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {statCards.map(({ title, value, note, icon: Icon, tone }) => (
        <Col xs={12} sm={12} lg={6} key={title}>
          <Card className={`admin-stat-card admin-stat-card--${tone}`} bordered={false}>
            <Statistic
              title={<span className="admin-stat-card__title">{title}</span>}
              value={value(stats)}
              valueStyle={{ color: "#242126", fontWeight: 800, fontSize: 32 }}
              suffix={<Icon className="admin-stat-card__icon" />}
            />
            <Text className="admin-stat-card__note">{note(stats)}</Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
