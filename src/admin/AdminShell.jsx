import { Link } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Layout,
  Menu,
  Space,
  Typography,
} from "antd";
import {
  CommentOutlined,
  DashboardOutlined,
  FileTextOutlined,
  GiftOutlined,
  GlobalOutlined,
  LogoutOutlined,
  PlusOutlined,
  ReadOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const pageTitles = {
  dashboard: "Bảng Điều Khiển Trung Tâm",
  submissions: "Quản Lý Đăng Ký Tuyển Sinh",
  teachers: "Danh Sách Đội Ngũ Giáo Viên",
  programs: "Chương Trình Đào Tạo & Câu Lạc Bộ",
  posts: "Quản Lý Tin Tức & Bài Viết Chia Sẻ",
  testimonials: "Cảm Nhận Từ Phụ Huynh Học Sinh",
  products: "Quản Lý Sản Phẩm Đồng Phục",
  promotions: "Quản Lý Chiến Dịch Tuyển Sinh & Ưu Đãi",
};

const createActions = {
  teachers: { label: "Thêm giáo viên mới", type: "teacher" },
  programs: { label: "Thêm chương trình / CLB", type: "program" },
  posts: { label: "Viết bài mới", type: "post" },
  testimonials: { label: "Thêm cảm nhận", type: "testimonial" },
  products: { label: "Thêm sản phẩm", type: "product" },
  promotions: { label: "Thêm ưu đãi mới", type: "promotion" },
};

export default function AdminShell({
  activeMenu,
  stats,
  adminUser,
  onMenuChange,
  onLogout,
  onOpenModal,
  children,
}) {
  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Tổng quan Dashboard" },
    {
      key: "submissions",
      icon: <SolutionOutlined />,
      label: (
        <span>
          Đăng ký Tuyển sinh{" "}
          {stats?.newSubmissions > 0 && (
            <Badge count={stats.newSubmissions} offset={[6, 0]} />
          )}
        </span>
      ),
    },
    { key: "promotions", icon: <GiftOutlined />, label: "Ưu đãi Tuyển sinh" },
    { key: "teachers", icon: <TeamOutlined />, label: "Đội ngũ Giáo viên" },
    { key: "programs", icon: <ReadOutlined />, label: "Chương trình & CLB" },
    { key: "posts", icon: <FileTextOutlined />, label: "Bài viết & Tin tức" },
    { key: "testimonials", icon: <CommentOutlined />, label: "Cảm nhận Phụ huynh" },
    { key: "products", icon: <ShoppingOutlined />, label: "Sản phẩm đồng phục" },
  ];
  const createAction = createActions[activeMenu];

  return (
    <Layout className="admin-layout-root">
      <Sider width={260} className="admin-sider" breakpoint="lg" collapsedWidth="0">
        <div className="admin-logo-box">
          <div className="logo-icon">🌱</div>
          <div className="logo-title">
            HAPPY MON
            <small>Admin Portal</small>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          onClick={({ key }) => onMenuChange(key)}
          items={menuItems}
          style={{ marginTop: 16, padding: "0 8px" }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 16,
            right: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <Avatar
              style={{ backgroundColor: "#e5bd61", color: "#203e30" }}
              icon={<UserOutlined />}
            />
            <div style={{ overflow: "hidden" }}>
              <Text
                style={{
                  color: "#fff",
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                }}
                ellipsis
              >
                {adminUser?.fullName || "Admin"}
              </Text>
              <Text style={{ color: "#8ca094", fontSize: 11 }} ellipsis>
                {adminUser?.email || "admin@happymon.edu.vn"}
              </Text>
            </div>
          </div>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Link to="/" target="_blank">
              <Button
                size="small"
                type="text"
                icon={<GlobalOutlined />}
                style={{ color: "#a6b9ad" }}
              >
                Website ↗
              </Button>
            </Link>
            <Button
              size="small"
              danger
              type="text"
              icon={<LogoutOutlined />}
              onClick={onLogout}
            >
              Thoát
            </Button>
          </Space>
        </div>
      </Sider>

      <Layout>
        <Header className="admin-header">
          <Title level={4} style={{ margin: 0, color: "#203e30" }}>
            {pageTitles[activeMenu]}
          </Title>
          <Space>
            {createAction && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => onOpenModal(createAction.type)}
              >
                {createAction.label}
              </Button>
            )}
          </Space>
        </Header>
        <Content className="admin-content-body">{children}</Content>
      </Layout>
    </Layout>
  );
}
