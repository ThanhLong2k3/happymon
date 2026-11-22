import { Card, Col, Row, Statistic, Typography } from "antd";
import {
  ClockCircleOutlined,
  FileTextOutlined,
  ReadOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export default function DashboardStatsRow({ stats }) {
  return (
    <Row
      className="admin-stats-row"
      gutter={[20, 20]}
      style={{ marginBottom: 24 }}
    >
      <Col xs={12} sm={12} lg={6}>
        <Card
          bordered={false}
          style={{
            background: "linear-gradient(135deg, #2b5541, #1e3d2e)",
            borderRadius: 12,
          }}
        >
          <Statistic
            title={
              <span style={{ color: "#e5bd61", fontWeight: 600 }}>
                Đơn đăng ký mới
              </span>
            }
            value={stats?.newSubmissions ?? 0}
            valueStyle={{ color: "#ffffff", fontWeight: 800, fontSize: 32 }}
            suffix={
              <ClockCircleOutlined style={{ fontSize: 22, opacity: 0.6 }} />
            }
          />
          <Text style={{ color: "#c2d4c8", fontSize: 12 }}>
            Tổng số: {stats?.totalSubmissions ?? 0} đơn
          </Text>
        </Card>
      </Col>

      <Col xs={12} sm={12} lg={6}>
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <Statistic
            title="Giáo viên & BGH"
            value={stats?.totalTeachers ?? 12}
            valueStyle={{ color: "#203e30", fontWeight: 800 }}
            suffix={<TeamOutlined style={{ color: "#34664e" }} />}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Đang giảng dạy
          </Text>
        </Card>
      </Col>

      <Col xs={12} sm={12} lg={6}>
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <Statistic
            title="Chương trình & CLB"
            value={stats?.totalPrograms ?? 7}
            valueStyle={{ color: "#203e30", fontWeight: 800 }}
            suffix={<ReadOutlined style={{ color: "#e5bd61" }} />}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Môn học & Ngoại khóa
          </Text>
        </Card>
      </Col>

      <Col xs={12} sm={12} lg={6}>
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <Statistic
            title="Bài viết & Chuyên đề"
            value={stats?.totalPosts ?? 45}
            valueStyle={{ color: "#203e30", fontWeight: 800 }}
            suffix={<FileTextOutlined style={{ color: "#40916c" }} />}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Tin tức & Chia sẻ
          </Text>
        </Card>
      </Col>
    </Row>
  );
}
