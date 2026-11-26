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
  AppstoreOutlined,
  CommentOutlined,
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  FormOutlined,
  GiftOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MailOutlined,
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
  contacts: "Qu\u1ea3n L\u00fd Li\u00ean h\u1ec7",
  dashboard: "Bảng Điều Khiển Trung Tâm",
  submissions: "Quản Lý Đăng Ký Tuyển Sinh",
  teachers: "Danh Sách Đội Ngũ Giáo Viên",
  programs: "Chương Trình Đào Tạo & Câu Lạc Bộ",
  posts: "Quản Lý Tin Tức & Bài Viết Chia Sẻ",
  testimonials: "Cảm Nhận Từ Phụ Huynh Học Sinh",
  products: "Quản Lý Sản Phẩm Đồng Phục",
  promotions: "Quản Lý Chiến Dịch Tuyển Sinh & Ưu Đãi",
  events: "Quản Lý Sự Kiện",
  aboutPage: "Nội Dung Trang Giới Thiệu",
  enrollmentPage: "Nội Dung Trang Tuyển Sinh",
};

const createActions = {
  teachers: { label: "Thêm giáo viên mới", type: "teacher" },
  programs: { label: "Thêm chương trình / CLB", type: "program" },
  posts: { label: "Viết bài mới", type: "post" },
  testimonials: { label: "Thêm cảm nhận", type: "testimonial" },
  products: { label: "Thêm sản phẩm", type: "product" },
  promotions: { label: "Thêm ưu đãi mới", type: "promotion" },
  events: { label: "Thêm sự kiện", type: "event" },
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
    { key: "dashboard", icon: <DashboardOutlined />, label: "Tổng quan" },
    {
      key: "websiteContent",
      icon: <AppstoreOutlined />,
      label: "Nội dung website",
      children: [
        { key: "posts", icon: <FileTextOutlined />, label: "Bài viết & Tin tức" },
        { key: "events", icon: <CalendarOutlined />, label: "Sự kiện" },
        { key: "aboutPage", icon: <InfoCircleOutlined />, label: "Trang Giới thiệu" },
        { key: "enrollmentPage", icon: <FormOutlined />, label: "Trang Tuyển sinh" },
      ],
    },
    {
      key: "admissions",
      icon: <SolutionOutlined />,
      label: "Tuyển sinh",
      children: [
        {
          key: "submissions",
          icon: <SolutionOutlined />,
          label: (
            <span>
              Đăng ký nhập học{" "}
              {stats?.newSubmissions > 0 && (
                <Badge count={stats.newSubmissions} offset={[6, 0]} />
              )}
            </span>
          ),
        },
        { key: "promotions", icon: <GiftOutlined />, label: "Ưu đãi tuyển sinh" },
      ],
    },
    {
      key: "school",
      icon: <TeamOutlined />,
      label: "Nhà trường",
      children: [
        { key: "teachers", icon: <TeamOutlined />, label: "Đội ngũ giáo viên" },
        { key: "programs", icon: <ReadOutlined />, label: "Chương trình & CLB" },
        { key: "testimonials", icon: <CommentOutlined />, label: "Cảm nhận phụ huynh" },
        { key: "products", icon: <ShoppingOutlined />, label: "Sản phẩm đồng phục" },
      ],
    },
    { key: "contacts", icon: <MailOutlined />, label: "Tin nhắn Liên hệ" },
  ];
  const selectedGroup = {
    posts: "websiteContent",
    events: "websiteContent",
    aboutPage: "websiteContent",
    enrollmentPage: "websiteContent",
    submissions: "admissions",
    promotions: "admissions",
    teachers: "school",
    programs: "school",
    testimonials: "school",
    products: "school",
  }[activeMenu];
  const createAction = createActions[activeMenu];

  return (
    <Layout className="admin-layout-root">
      <Sider width={260} className="admin-sider" breakpoint="lg" collapsedWidth="0">
        <div className="admin-logo-box">
          <img className="logo-image" src="/HappyMon.png" alt="Happy Montessori" />
          <div className="logo-title">
            HAPPY MON
            <small>Admin Portal</small>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          defaultOpenKeys={selectedGroup ? [selectedGroup] : []}
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
            borderTop: "1px solid #eee3f0",
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
              style={{ backgroundColor: "#e5bd61", color: "#4d0057" }}
              icon={<UserOutlined />}
            />
            <div style={{ overflow: "hidden" }}>
              <Text
                style={{
                  color: "#342d36",
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                }}
                ellipsis
              >
                {adminUser?.fullName || "Admin"}
              </Text>
              <Text style={{ color: "#706876", fontSize: 11 }} ellipsis>
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
                style={{ color: "#625b68" }}
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
          <Title level={4} style={{ margin: 0, color: "#750285" }}>
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
